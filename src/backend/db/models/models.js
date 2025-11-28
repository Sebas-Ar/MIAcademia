import mongoose from 'mongoose'

// Importar AgendaSlot para que las referencias funcionen correctamente con populate()
// eslint-disable-next-line no-unused-vars

const { Schema } = mongoose

const ChatSchema = new Schema({
    date: { type: Date, default: null },
    userEmail: { type: String, default: null },
    anonimousUserID: { type: String, default: null },
    testID: { type: String, default: null },
    navigator: { type: String, default: null },
    suggestionID: { type: String, default: null },
    rating: { type: Number, default: null },
    userQuery: { type: String, default: null },
    model: { type: String, default: null },
    programsList: { type: Array, default: null },
    attemptsListSQL: [
        {
            attempt: { type: Number, default: 0 },
            querySQL: { type: String, default: null },
            currentUserQuery: { type: String, default: null },
            errGenerateSQL: { type: String, default: null },
            errorGetProgramsList: { type: String, default: null }
        }
    ],
    response: { type: String, default: null },
    responseError: { type: String, default: null },
    times: {
        startRequest: { type: Date, default: null },
        startQuerySQL: { type: Date, default: null },
        endQuerySQL: { type: Date, default: null },
        startResponse: { type: Date, default: null },
        endResponse: { type: Date, default: null },
        endRequest: { type: Date, default: null }
    },
    selectedProgramsList: { type: [String], default: [] }
})

const MiaConfigSchema = new Schema({
    SQLGenerator: { type: String, default: null },
    responseGenerator: { type: String, default: null }
})

const CounselingSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
})

const LocationSchema = new Schema({
    instituteName: { type: String, required: true },
    dep: { type: String, required: true },
    mun: { type: String, required: true },
    location: {
        places: [
            {
                formattedAddress: { type: String, required: true }
            }
        ]
    }
})

const LogSchema = new Schema({
    date: { type: Date, required: true },
    navigator: { type: String, default: null },
    userQuery: { type: String, default: null },
    suggestionID: { type: String, default: null },
    getProgramsListDB: { type: String, default: null },
    rating: { type: Number, default: null },
    querySQL: { type: String, default: null },
    programsList: { type: Array, default: null },
    retryQuerySql: { type: String, default: null },
    sqlError: { type: String, default: null },
    response: { type: String, default: null },
    responseError: { type: String, default: null },
    anonimousUserID: { type: String, default: null },
    userEmail: { type: String, default: null },
    times: {
        startRequest: { type: Date, default: null },
        startQuerySQL: { type: Date, default: null },
        endQuerySQL: { type: Date, default: null },
        startResponse: { type: Date, default: null },
        endResponse: { type: Date, default: null },
        endRequest: { type: Date, default: null }
    },
    testID: { type: String, default: null },
    attemptsListSQL: [
        {
            attempt: { type: Number, default: 0 },
            querySQL: { type: String, default: null },
            currentUserQuery: { type: String, default: null },
            errGenerateSQL: { type: String, default: null },
            errorGetProgramsList: { type: String, default: null }
        }
    ]
})

const SuggestionSchema = new Schema({
    text: { type: String, required: true },
    selected: { type: Number, default: 0 }
})

const UserSchema = new Schema({
    googleID: { type: String, default: null },
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, default: null },

    // DATOS DE SESIONES AGENDADAS
    scheduledSessions: {
        sessions: [{
            type: Schema.Types.ObjectId,
            ref: 'AgendaSlot'
        }]
    }
}, {
    timestamps: true,
    strictPopulate: false
})

const VocationalTestSchema = new Schema({
    userID: { type: String, default: null },
    userEmail: { type: String, default: null },
    anonimousUserID: { type: String, default: null },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date, default: null },
    duration: { type: Number, default: null },
    result: { type: String, default: null },
    questionary: { type: Array, default: [] },
    questionsListAleatory: { type: Array, default: [] },
    questionsNumber: { type: Number, default: 0 },
    selectedPrograms: { type: [String], default: [] }
})

const PlanSchema = new Schema({
    route: { type: String, required: true },
    icon: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    backgroundColor: { type: String, required: true },
    transparentBackground: { type: String, required: true },
    price: { type: Number, required: true },
    numberDiscount: { type: Number, default: 0 },
    sessionsNumber: { type: Number, required: true },
    sessionTime: { type: Number, required: true },
    sessionTimeUnit: { type: String, required: true },
    includesList: { type: [String], required: true },
    btnText: { type: String, required: true },
    detailList: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            duration: { type: String, required: true }
        }
    ],
    benefitsList: { type: [String], default: [] },
    currency: { type: String, required: true },
    isPopular: { type: Boolean, default: false },
    modalidad: { type: String, required: true },
    entities: { type: [String], default: [] },
    // Configuración de tiempo entre sesiones
    sessionInterval: {
        minDays: { type: Number, default: 2 }, // Mínimo días entre sesiones
        maxDays: { type: Number, default: 7 } // Máximo días entre sesiones
    }
})

export const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema)
export const MiaConfig = mongoose.models.MiaConfig || mongoose.model('MiaConfig', MiaConfigSchema)
export const Counseling = mongoose.models.Counseling || mongoose.model('Counseling', CounselingSchema)
export const Location = mongoose.models.Location || mongoose.model('Location', LocationSchema)
export const Log = mongoose.models.Log || mongoose.model('Log', LogSchema)
export const Suggestion = mongoose.models.Suggestion || mongoose.model('Suggestion', SuggestionSchema)
export const User = mongoose.models.User || mongoose.model('User', UserSchema)
export const VocationalTest = mongoose.models.VocationalTest || mongoose.model('VocationalTest', VocationalTestSchema)
export const Plan = mongoose.models.Plan || mongoose.model('Plan', PlanSchema)
