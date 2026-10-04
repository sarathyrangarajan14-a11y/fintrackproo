import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean, decimal, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  phoneNumber: text('phone_number'),
  fullName: text('full_name'),
  role: text('role').notNull().default('CLIENT'), // CLIENT, PARTNER, ADMIN, SUPER_ADMIN
  status: text('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
});

export const partners = pgTable('partners', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  arnNumber: text('arn_number'),
  companyName: text('company_name'),
  euin: text('euin'),
  brandingLogo: text('branding_logo'),
});

export const families = pgTable('families', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  partnerId: integer('partner_id').references(() => partners.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id), // Nullable if unregistered lead
  partnerId: integer('partner_id').references(() => partners.id).notNull(),
  familyId: integer('family_id').references(() => families.id),
  clientStatus: text('client_status').default('LEAD'), // LEAD, REGISTRATION_PENDING, REGISTERED
  kycStatus: text('kyc_status').default('NOT_STARTED'), // NOT_STARTED, INITIATED, SUBMITTED, VERIFIED
  
  // Encrypted or masked in real production, stored here for demo
  pan: text('pan'),
  dob: text('dob'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  pincode: text('pincode'),
  // KYC Additional Fields
  gender: text('gender'),
  fatherName: text('father_name'),
  maritalStatus: text('marital_status'),
  aadhaarNumber: text('aadhaar_number'),
  bankAccountName: text('bank_account_name'),
  bankName: text('bank_name'),
  bankAccountNumber: text('bank_account_number'),
  bankIfsc: text('bank_ifsc'),
  bankAccountType: text('bank_account_type'),
  occupation: text('occupation'),
  annualIncome: text('annual_income'),
  sourceOfIncome: text('source_of_income'),
  investmentExperience: text('investment_experience'),
  isFatca: boolean('is_fatca').default(false),
  isPep: boolean('is_pep').default(false),
  nomineeName: text('nominee_name'),
  nomineeRelation: text('nominee_relation'),
  panDocumentUrl: text('pan_document_url'),
  aadhaarDocumentUrl: text('aadhaar_document_url'),
  bankProofUrl: text('bank_proof_url'),
  photoUrl: text('photo_url'),
  signatureUrl: text('signature_url'),
  kycRejectionReason: text('kyc_rejection_reason'),
  kycVerifiedAt: timestamp('kyc_verified_at'),
  kycVerifiedBy: integer('kyc_verified_by'), // Partner ID
  
  riskProfile: text('risk_profile'),
  invitationDate: timestamp('invitation_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const watchlists = pgTable('watchlists', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  schemeCode: text('scheme_code').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const portfolios = pgTable('portfolios', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => clients.id).notNull(),
  folioNumber: text('folio_number'),
  schemeCode: text('scheme_code').notNull(),
  schemeName: text('scheme_name').notNull(),
  units: decimal('units').notNull(),
  averagePrice: decimal('average_price').notNull(),
  investedAmount: decimal('invested_amount').notNull(),
  lastNavUpdated: timestamp('last_nav_updated'),
});

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => clients.id).notNull(),
  schemeCode: text('scheme_code').notNull(),
  type: text('type').notNull(), // BUY, SELL, SIP, SWITCH, STP, SWP
  amount: decimal('amount').notNull(),
  units: decimal('units'),
  nav: decimal('nav'),
  status: text('status').notNull().default('PENDING'), // PENDING, AWAITING_CLIENT_APPROVAL, SUCCESS, FAILED
  orderId: text('order_id'),
  transactionDate: timestamp('transaction_date').defaultNow(),
});

export const sips = pgTable('sips', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => clients.id).notNull(),
  schemeCode: text('scheme_code').notNull(),
  amount: decimal('amount').notNull(),
  frequency: text('frequency').notNull(), // MONTHLY, WEEKLY
  sipDate: integer('sip_date').notNull(),
  nextInstallmentDate: timestamp('next_installment_date'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  status: text('status').notNull().default('ACTIVE'), // ACTIVE, PAUSED, CANCELLED
});

export const mandates = pgTable('mandates', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => clients.id).notNull(),
  mandateType: text('mandate_type').notNull(), // E_MANDATE, NACH, UPI
  amountLimit: decimal('amount_limit').notNull(),
  status: text('status').notNull(), // PENDING, ACTIVE, REJECTED
  creationDate: timestamp('creation_date').defaultNow(),
});

export const goals = pgTable('goals', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => clients.id).notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  targetAmount: decimal('target_amount').notNull(),
  currentSavings: decimal('current_savings').notNull().default('0'),
  targetDate: timestamp('target_date').notNull(),
});

export const crmTasks = pgTable('crm_tasks', {
  id: serial('id').primaryKey(),
  partnerId: integer('partner_id').references(() => partners.id).notNull(),
  clientId: integer('client_id').references(() => clients.id),
  title: text('title').notNull(),
  description: text('description'),
  taskType: text('task_type'), // CALL, MEETING, FOLLOW_UP, REVIEW
  priority: text('priority').default('MEDIUM'),
  dueDate: timestamp('due_date'),
  status: text('status').default('PENDING'),
});

export const opportunities = pgTable('opportunities', {
  id: serial('id').primaryKey(),
  partnerId: integer('partner_id').references(() => partners.id).notNull(),
  clientId: integer('client_id').references(() => clients.id).notNull(),
  type: text('type').notNull(), // SIP_TOPUP, IDLE_CASH, TAX_SAVING
  description: text('description').notNull(),
  potentialAum: decimal('potential_aum'),
  status: text('status').default('OPEN'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  partnerId: integer('partner_id').references(() => partners.id).notNull(),
  clientId: integer('client_id').references(() => clients.id),
  reportType: text('report_type').notNull(), // PORTFOLIO, CAPITAL_GAINS, BUSINESS
  status: text('status').default('GENERATING'),
  downloadUrl: text('download_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  details: jsonb('details'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const instruments = pgTable('instruments', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(), // AMFI scheme code (e.g., "120503") or ETF symbol (e.g., "NIFTYBEES.NS")
  symbol: text('symbol'),
  name: text('name').notNull(),
  fundHouse: text('fund_house'),
  category: text('category'),
  schemeType: text('scheme_type').notNull(), // MUTUAL_FUND or ETF
  exchange: text('exchange').default('AMFI'), // AMFI, NSE, BSE
  
  // NAV / Price fields
  currentPrice: decimal('current_price'),
  previousClose: decimal('previous_close'),
  dayChange: decimal('day_change'),
  dayChangePercentage: decimal('day_change_percentage'),
  priceDate: text('price_date'),
  
  // ETF specifics
  dayHigh: decimal('day_high'),
  dayLow: decimal('day_low'),
  volume: decimal('volume'),
  
  // Cache payload & timestamps
  historicalData: jsonb('historical_data'),
  meta: jsonb('meta'),
  lastSyncedAt: timestamp('last_synced_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  client: one(clients, { fields: [users.id], references: [clients.userId] }),
  partner: one(partners, { fields: [users.id], references: [partners.userId] }),
  watchlists: many(watchlists),
}));

export const partnersRelations = relations(partners, ({ one, many }) => ({
  user: one(users, { fields: [partners.userId], references: [users.id] }),
  clients: many(clients),
  families: many(families),
  tasks: many(crmTasks),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
  partner: one(partners, { fields: [clients.partnerId], references: [partners.id] }),
  family: one(families, { fields: [clients.familyId], references: [families.id] }),
  portfolios: many(portfolios),
  transactions: many(transactions),
  sips: many(sips),
  mandates: many(mandates),
  goals: many(goals),
  tasks: many(crmTasks),
}));

export const familiesRelations = relations(families, ({ many }) => ({
  members: many(clients),
}));

export const portfoliosRelations = relations(portfolios, ({ one }) => ({
  client: one(clients, { fields: [portfolios.clientId], references: [clients.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  client: one(clients, { fields: [transactions.clientId], references: [clients.id] }),
}));

export const sipsRelations = relations(sips, ({ one }) => ({
  client: one(clients, { fields: [sips.clientId], references: [clients.id] }),
}));

export const mandatesRelations = relations(mandates, ({ one }) => ({
  client: one(clients, { fields: [mandates.clientId], references: [clients.id] }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  client: one(clients, { fields: [goals.clientId], references: [clients.id] }),
}));

export const crmTasksRelations = relations(crmTasks, ({ one }) => ({
  client: one(clients, { fields: [crmTasks.clientId], references: [clients.id] }),
  partner: one(partners, { fields: [crmTasks.partnerId], references: [partners.id] }),
}));
