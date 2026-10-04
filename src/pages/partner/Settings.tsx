import React, { useState } from "react";
import { User, Bell, Shield, Building2, Save, FileText, Terminal, Download, Mail } from "lucide-react";
import { generateTechnicalSpecPdf } from "../../lib/pdfGenerator";

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Email Sandbox States
  const [emailFrom, setEmailFrom] = useState("onboarding@resend.dev");
  const [emailTo, setEmailTo] = useState("sarathyrangarajan14@gmail.com");
  const [emailSubject, setEmailSubject] = useState("Hello World");
  const [emailHtml, setEmailHtml] = useState("<p>Congrats on sending your <strong>first email</strong>!</p>");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState("");

  const handleSendEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    setEmailStatus("sending");
    setEmailError("");
    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: emailFrom,
          to: emailTo,
          subject: emailSubject,
          html: emailHtml,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to dispatch test email.");
      }
      setEmailStatus("success");
    } catch (err: any) {
      console.error(err);
      setEmailStatus("error");
      setEmailError(err.message || "An unexpected error occurred.");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const handleDownloadSpec = (e: React.MouseEvent) => {
    e.preventDefault();
    const doc = generateTechnicalSpecPdf();
    doc.save("fintrackpro_velocity_wealth_technical_specification.pdf");
  };

  return (
    <div className="flex-1 p-4 md:p-8 relative z-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Manage your firm profile, ARN details, and preferences.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'profile' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <User className="h-4 w-4" /> Personal Info
            </button>
            <button
              onClick={() => setActiveTab('firm')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'firm' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Building2 className="h-4 w-4" /> Firm Details
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'notifications' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Bell className="h-4 w-4" /> Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'security' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Shield className="h-4 w-4" /> Security
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('developer')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'developer' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Terminal className="h-4 w-4 text-emerald-400" /> Technical Specs
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('email-sandbox')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'email-sandbox' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Mail className="h-4 w-4 text-indigo-400" /> Email Sandbox
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 md:p-8">
              <form onSubmit={handleSave}>
                {activeTab === 'profile' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-lg font-bold text-white mb-2">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400">Full Name</label>
                        <input type="text" defaultValue="PARTHASARATHY Radhakrishnan" className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400">Email Address</label>
                        <input type="email" defaultValue="sarathyrangarajan14@gmail.com" className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400">Phone Number</label>
                        <input type="tel" defaultValue="7045251730" className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'firm' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-lg font-bold text-white mb-2">Firm Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400">Firm Name</label>
                        <input type="text" defaultValue="VELOCITY WEALTH (FinTrackPro)" className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400">ARN Number</label>
                        <input type="text" defaultValue="348996" className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400">EUIN (Optional)</label>
                        <input type="text" placeholder="Enter EUIN" className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                      </div>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs font-bold text-slate-400">Registered Office Address</label>
                      <input type="text" defaultValue="Mumbai, Maharashtra" className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-[#1e293b] border border-slate-700 rounded-xl">
                        <div>
                          <p className="font-bold text-white">Client KYC Updates</p>
                          <p className="text-sm text-slate-400">Get notified when a client completes KYC</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-[#1e293b] border border-slate-700 rounded-xl">
                        <div>
                          <p className="font-bold text-white">SIP Failures / Bounces</p>
                          <p className="text-sm text-slate-400">Alert me immediately if a client SIP fails</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-[#1e293b] border border-slate-700 rounded-xl">
                        <div>
                          <p className="font-bold text-white">Daily Summary Email</p>
                          <p className="text-sm text-slate-400">Receive a daily digest of all transactions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-400">New Password</label>
                          <input type="password" placeholder="Enter new password" className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-400">Confirm Password</label>
                          <input type="password" placeholder="Confirm new password" className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'developer' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-6">
                      <Terminal className="h-6 w-6 text-emerald-400" />
                      <h2 className="text-xl font-bold text-white">System Documentation & Technical Specs</h2>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      Download the comprehensive, architecturally validated Website Technical Specification Document for the <strong>FinTrackPro / VELOCITY WEALTH Platform</strong>. This document includes system diagrams, database schema definitions, secure endpoint API specs, containerization architectures, and high-performance bundles documentation.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                      <div className="p-4 bg-[#1e293b]/50 border border-slate-800 rounded-2xl">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Platform Architecture</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">Full-stack React 19 SPA + Express.js backend, built with Vite, TypeScript, and deployed in zero-cold-start Cloud Run Docker containers.</p>
                      </div>
                      <div className="p-4 bg-[#1e293b]/50 border border-slate-800 rounded-2xl">
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Security Perimeter</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">Firebase Authentication token validation, secure service-agent bindings, HTTPS encryption, and granular collection rules.</p>
                      </div>
                      <div className="p-4 bg-[#1e293b]/50 border border-slate-800 rounded-2xl">
                        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Data & APIs</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">Real-time stock feeds (Yahoo Finance), Indian Mutual Fund indices, Instamojo payment gateway, and secure Firestore REST API proxies.</p>
                      </div>
                    </div>

                    <div className="bg-indigo-950/30 border border-indigo-500/20 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                          <FileText className="h-4 w-4 text-indigo-400" /> Technical Specification v1.4.0 (PDF)
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">Multi-page professional layout with covers, schema catalogs, and route mappings.</p>
                      </div>
                      <button
                        onClick={handleDownloadSpec}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
                      >
                        <Download className="h-4 w-4" /> Download Specification
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'email-sandbox' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-4">
                      <Mail className="h-6 w-6 text-emerald-400" />
                      <h2 className="text-xl font-bold text-white">Outbound Email Sandbox (Resend)</h2>
                    </div>
                    
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Send verified emails safely via our secure proxy using your Resend integration. Standard sandbox accounts support delivery to the verified owner address (<strong className="text-slate-300">sarathyrangarajan14@gmail.com</strong>) from <strong className="text-slate-300">onboarding@resend.dev</strong>.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">From (Sender Address)</label>
                        <input 
                          type="text" 
                          value={emailFrom} 
                          onChange={(e) => setEmailFrom(e.target.value)} 
                          placeholder="onboarding@resend.dev" 
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">To (Recipient Address)</label>
                        <input 
                          type="text" 
                          value={emailTo} 
                          onChange={(e) => setEmailTo(e.target.value)} 
                          placeholder="sarathyrangarajan14@gmail.com" 
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject Line</label>
                      <input 
                        type="text" 
                        value={emailSubject} 
                        onChange={(e) => setEmailSubject(e.target.value)} 
                        placeholder="Hello from Resend!" 
                        className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm" 
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">HTML Body Message</label>
                        <button
                          type="button"
                          onClick={() => setEmailHtml('<p>Congrats on sending your <strong>first email</strong>!</p>')}
                          className="text-[10px] text-indigo-400 hover:underline"
                        >
                          Reset Template
                        </button>
                      </div>
                      <textarea 
                        rows={6} 
                        value={emailHtml} 
                        onChange={(e) => setEmailHtml(e.target.value)} 
                        placeholder="<p>Congrats on sending your first email!</p>" 
                        className="w-full font-mono text-xs bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      ></textarea>
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-800">
                      <div>
                        {emailStatus === 'success' && (
                          <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                            ✓ Email delivered successfully via Resend proxy!
                          </span>
                        )}
                        {emailStatus === 'error' && (
                          <span className="text-red-400 text-xs font-bold">
                            ✕ {emailError || 'Failed to dispatch email.'}
                          </span>
                        )}
                        {emailStatus === 'sending' && (
                          <span className="text-amber-400 text-xs font-bold flex items-center gap-1.5">
                            <span className="h-2 w-2 bg-amber-400 rounded-full animate-ping"></span>
                            Connecting to Resend servers...
                          </span>
                        )}
                      </div>
                      <button 
                        type="button"
                        onClick={handleSendEmail}
                        disabled={emailStatus === 'sending'}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-colors cursor-pointer shadow-lg disabled:opacity-70"
                      >
                        <Mail className="h-4 w-4" /> Send Test Email
                      </button>
                    </div>
                  </div>
                )}

                {activeTab !== 'developer' && activeTab !== 'email-sandbox' && (
                  <div className="mt-8 pt-8 border-t border-slate-800 flex items-center justify-end">
                    {saved && <span className="text-emerald-400 text-sm font-bold mr-4">Settings saved successfully!</span>}
                    <button 
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-8 py-3 text-sm font-bold text-white hover:bg-indigo-600 transition-colors disabled:opacity-70"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
