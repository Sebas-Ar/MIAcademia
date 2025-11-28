import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import AgendaAdmin from './AgendaAdmin'
import BtnSubmit from './BtnSubmit'
import Introduction from './Introduction'
import MIALogs from './MIALogs'
import PlansAdmin from './PlansAdmin'
import Rules from './RulesList'
import SuggestionsList from './SuggestionsList'
import UpdateDB from './UpdateDB'
import VocationalTestLogs from './VocationalTestLogs'
import WrapperConfig from './WrapperConfig'

const IAConfig = () => {
    // States
    const [rulesSQLGenerator, setRulesSQLGenerator] = useState([])
    const [rulesResponseGenerator, setRulesResponseGenerator] = useState([])
    const [navigationSQL, setNavigationSQL] = useState('')
    const [navigationRes, setNavigationRes] = useState('')
    const [navigationLogs, setNavigationLogs] = useState('')
    const [navigationDB, setNavigationDB] = useState('')
    const [navigationAgenda, setNavigationAgenda] = useState('')
    const [navigationSuggestion, setNavigationSuggestion] = useState('')
    const [initialValues, setInitialValues] = useState({
        SQLGenerator: {
            introduction: '',
            rules: []
        },
        responseGenerator: {
            introduction: '',
            rules: []
        }
    })
    const [isFormUpdated, setIsFormUpdated] = useState(false)
    const [loading, setLoading] = useState(false)

    // useForm is a custom hook that allows you to manage form state and validation
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: async () => {
            try {
                const dafultValues = {}
                const response = await fetch('/api/mia/config')
                const data = await response.json()
                setRulesSQLGenerator(data.SQLGenerator.rules)
                setRulesResponseGenerator(data.responseGenerator.rules)
                setInitialValues({
                    SQLGenerator: {
                        introduction: data.SQLGenerator.introduction,
                        rules: data.SQLGenerator.rules
                    },
                    responseGenerator: {
                        introduction: data.responseGenerator.introduction,
                        rules: data.responseGenerator.rules
                    }
                })

                dafultValues.SQLGeneratorIntroduction = data.SQLGenerator.introduction
                data.SQLGenerator.rules.forEach((rule) => {
                    dafultValues[rule.id] = rule.rule
                    dafultValues[`${rule.id}Enable`] = rule.enabled
                })
                dafultValues.responseGeneratorIntroduction = data.responseGenerator.introduction
                data.responseGenerator.rules.forEach((rule) => {
                    dafultValues[rule.id] = rule.rule
                    dafultValues[`${rule.id}Enable`] = rule.enabled
                })

                return dafultValues
            } catch (error) {
                return {
                    SQLGeneratorIntroduction: '',
                    responseGeneratorIntroduction: ''
                }
            }
        }
    })

    const formData = watch(undefined)

    useEffect(() => {
        if (rulesSQLGenerator.length > 0 || rulesResponseGenerator.length > 0 || formData.SQLGeneratorIntroduction || formData.responseGeneratorIntroduction) {
            const SQLGeneratorRules = mapFormDataToRules(rulesSQLGenerator, formData)
            const responseGeneratorRules = mapFormDataToRules(rulesResponseGenerator, formData)

            const isDiff = initialValues.SQLGenerator.introduction !== formData.SQLGeneratorIntroduction ||
                    initialValues.responseGenerator.introduction !== formData.responseGeneratorIntroduction ||
                    verifyDiff(initialValues.SQLGenerator.rules, SQLGeneratorRules) ||
                    verifyDiff(initialValues.responseGenerator.rules, responseGeneratorRules) ||
                    initialValues.SQLGenerator.rules.length !== SQLGeneratorRules.length ||
                    initialValues.responseGenerator.rules.length !== responseGeneratorRules.length
            setIsFormUpdated(isDiff)
        }
    }, [formData])

    const verifyDiff = (initRules = [], currenRules = []) => {
        return initRules.some((initRule, index) => {
            if (initRule.rule !== currenRules[index]?.rule ||
                initRule.enabled !== currenRules[index]?.enabled) {
                return true
            }
            return false
        })
    }

    // Update the rules in DB
    const onSubmit = async (data) => {
        setLoading(true)

        const SQLRules = mapFormDataToRules(rulesSQLGenerator, data)
        const ResRules = mapFormDataToRules(rulesResponseGenerator, data)
        const miaConfig = {
            SQLGenerator: {
                introduction: data.SQLGeneratorIntroduction,
                rules: SQLRules
            },
            responseGenerator: {
                introduction: data.responseGeneratorIntroduction,
                rules: ResRules
            }
        }

        try {
            const response = await fetch('/api/mia/config', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(miaConfig)
            })

            await response.json()
            setInitialValues(miaConfig)
            setRulesSQLGenerator(SQLRules)
            setRulesResponseGenerator(ResRules)
            // alert('Config saved')
        } catch (error) {
            console.log(error)
        } finally {
            setIsFormUpdated(false)
            setLoading(false)
        }
    }

    const mapFormDataToRules = (rulesForm, data) => {
        return rulesForm.map((rule) => {
            return {
                id: rule.id,
                rule: data[rule.id],
                enabled: data[`${rule.id}Enable`]
            }
        })
    }

    const toggleRuleState = (id, setState, disableEditMode) => {
        disableEditMode()
        setState(current => {
            return current.map((rule, i) => {
                if (rule.id === id) {
                    return {
                        ...rule,
                        enabled: !rule.enabled
                    }
                }
                return rule
            })
        })
    }

    return (
        <div className='wrapper-config'>
            <div className="center">
                <h1>IA Configuration</h1>
                <p>Here you can configure the IA to your liking.</p>

                <form onSubmit={ handleSubmit(onSubmit) }>
                    <WrapperConfig
                        title="SQL AI"
                        setNavigation={setNavigationSQL}
                        navigation={navigationSQL}
                        paths={['introduction', 'rules']}
                    >
                        {navigationSQL === 'introduction' &&
                            <Introduction
                                register={register}
                                setValue={setValue}
                                errors={errors}
                                id='SQLGeneratorIntroduction'
                                initialValue={initialValues.SQLGenerator.introduction}
                            />}

                        {navigationSQL === 'rules' &&
                            <Rules
                                register={register}
                                errors={errors}
                                setValue={setValue}
                                rulesList={rulesSQLGenerator}
                                updateRules={setRulesSQLGenerator}
                                toggleRuleState={toggleRuleState}
                                // initialValue={initialValues.SQLGenerator.rules}
                                formData={formData}
                            />}

                    </WrapperConfig>
                    <WrapperConfig
                        title="Response AI"
                        setNavigation={setNavigationRes}
                        navigation={navigationRes}
                        paths={['introduction', 'rules']}
                    >
                        {navigationRes === 'introduction' &&
                            <Introduction
                                register={register}
                                setValue={setValue}
                                errors={errors}
                                id='responseGeneratorIntroduction'
                                initialValue={initialValues.responseGenerator.introduction}
                            />}

                        {navigationRes === 'rules' &&
                            <Rules
                                register={register}
                                errors={errors}
                                setValue={setValue}
                                rulesList={rulesResponseGenerator}
                                updateRules={setRulesResponseGenerator}
                                toggleRuleState={toggleRuleState}
                                // initialValue={initialValues.responseGenerator.rules}
                                formData={formData}
                            />}

                    </WrapperConfig>
                    <BtnSubmit
                        isFormUpdated={isFormUpdated}
                        loading={loading}
                    />
                </form>
                <WrapperConfig
                    title="Suggestions"
                    setNavigation={setNavigationSuggestion}
                    navigation={navigationSuggestion}
                    paths={['view']}
                >
                    {navigationSuggestion === 'view' &&
                        <SuggestionsList />}

                </WrapperConfig>
                <WrapperConfig
                    title="Logs"
                    setNavigation={setNavigationLogs}
                    navigation={navigationLogs}
                    paths={['MIA', 'Vocational Test']}
                >
                    {navigationLogs === 'MIA' &&
                        <MIALogs />}
                    {navigationLogs === 'Vocational Test' &&
                        <VocationalTestLogs />}

                </WrapperConfig>
                <WrapperConfig
                    title="Asesoria vocacional"
                    setNavigation={setNavigationAgenda}
                    navigation={navigationAgenda}
                    paths={['agenda', 'Plans']}
                >
                    {navigationAgenda === 'agenda' &&
                        <AgendaAdmin />}
                    {navigationAgenda === 'Plans' &&
                        <PlansAdmin />}

                </WrapperConfig>
                <WrapperConfig
                    title="Database"
                    setNavigation={setNavigationDB}
                    navigation={navigationDB}
                    paths={['update']}
                >
                    {navigationDB === 'update' &&
                        <UpdateDB />}

                </WrapperConfig>
            </div>

            <style jsx>{`

                .wrapper-config {
                    position: relative;
                    padding-top: 1.5em;
                    height: calc(100vh - 10.88em);
                    display: grid;
                    overflow-y: auto;
                    grid-template-rows: auto auto 1fr;
                    mask-image: linear-gradient(to top, transparent 0%, black 0%, black 100%, transparent 100%);
                }

                .center {
                    width: 100%;
                    max-width: 80em;
                    margin: auto;
                }

                .wrapper-config::-webkit-scrollbar {
                    width: .5em;
                }

                .wrapper-config::-webkit-scrollbar-track {
                    background-color: var(--light-gray);
                }

                .wrapper-config::-webkit-scrollbar-thumb {
                    background-color: var(--dark-blue);
                    border-radius: 5px;
                }

                @supports not selector(::-webkit-scrollbar) {
                    .wrapper-config {
                        scrollbar-color: var(--dark-blue)
                                        var(--light-gray);
                    }
                }

                h1 {
                    text-align: center;
                    font-size: 1.5em;
                    font-weight: 500;
                    text-transform: capitalize;
                }

                p {
                    text-align: center;
                    font-weight: 400;
                    margin-bottom: 1em;
                }

                form {
                    margin-inline: auto;
                    width: 100%;
                }

                

            `}</style>
        </div>
    )
}

export default IAConfig
