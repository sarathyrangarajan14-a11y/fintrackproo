import firebaseConfig from '../../firebase-applet-config.json';

const getBaseUrl = () => `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents`;

function formatDocument(docData: any) {
    if (!docData || !docData.fields) return null;
    const result: any = {};
    for (const key in docData.fields) {
        const val = docData.fields[key];
        if (val.stringValue !== undefined) result[key] = val.stringValue;
        else if (val.booleanValue !== undefined) result[key] = val.booleanValue;
        else if (val.integerValue !== undefined) result[key] = Number(val.integerValue);
        else if (val.doubleValue !== undefined) result[key] = val.doubleValue;
        else if (val.mapValue !== undefined) result[key] = formatDocument(val.mapValue);
        else if (val.arrayValue !== undefined) result[key] = val.arrayValue.values ? val.arrayValue.values.map((v: any) => v.stringValue || v.integerValue || v.booleanValue) : [];
        else result[key] = val; // fallback
    }
    return result;
}

function encodeDocument(data: any) {
    const fields: any = {};
    for (const key in data) {
        if (data[key] === null || data[key] === undefined) continue;
        const type = typeof data[key];
        if (type === 'string') fields[key] = { stringValue: data[key] };
        else if (type === 'boolean') fields[key] = { booleanValue: data[key] };
        else if (type === 'number') {
            if (Number.isInteger(data[key])) fields[key] = { integerValue: data[key].toString() };
            else fields[key] = { doubleValue: data[key] };
        } else if (Array.isArray(data[key])) {
             fields[key] = { arrayValue: { values: data[key].map((v: any) => typeof v === 'string' ? {stringValue: v} : {stringValue: String(v)}) } };
        }
    }
    return { fields };
}

export async function getDocumentREST(collection: string, docId: string, token?: string) {
    let url = `${getBaseUrl()}/${collection}/${docId}`;
    const headers: Record<string, string> = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else if (firebaseConfig.apiKey) {
        url += `?key=${firebaseConfig.apiKey}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) {
        if (res.status === 404) return null;
        console.error(`Firestore GET failed: ${res.status} ${await res.text()}`);
        return null;
    }
    const data = await res.json();
    return formatDocument(data);
}

export async function setDocumentREST(collection: string, docId: string, data: any, token?: string) {
    const body = encodeDocument(data);
    let url = `${getBaseUrl()}/${collection}/${docId}`;
    
    // Add updateMask for PATCH so we don't overwrite the whole document
    const params = new URLSearchParams();
    for (const key in data) {
        params.append('updateMask.fieldPaths', key);
    }
    if (!token && firebaseConfig.apiKey) {
        params.append('key', firebaseConfig.apiKey);
    }
    url += '?' + params.toString();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, { 
        method: 'PATCH', 
        headers,
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Firestore SET failed: ${res.status} ${await res.text()}`);
    return await res.json();
}

export async function deleteDocumentREST(collection: string, docId: string, token?: string) {
    let url = `${getBaseUrl()}/${collection}/${docId}`;
    const headers: Record<string, string> = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else if (firebaseConfig.apiKey) {
        url += `?key=${firebaseConfig.apiKey}`;
    }

    const res = await fetch(url, {
        method: 'DELETE',
        headers
    });
    if (!res.ok && res.status !== 404) {
        console.error(`Firestore DELETE failed: ${res.status} ${await res.text()}`);
        return false;
    }
    return true;
}
