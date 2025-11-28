import { GraduationCap, PersonStanding, University } from 'lucide-react'
import ChatQueryOptions from './ChatQueryOptions'
import ChatQuestionFilter from './ChatQuestionFilter'

const ChatQuestion = ({
    isResponding,
    editQuery,
    reloadQuery,
    userQuery = {},
    chatRate = null,
    chatID = '',
    setRating = () => { },
    rating = null
}) => {
    console.log({ chatRate })
    return userQuery?.consulta && (
        <div className="wrapper-question">
            <div className="question">
                <p className="question-text">{userQuery?.consulta}</p>
                <ul className="question-filters-wrapper">
                    <span className="question-filters-title">
                        Filtros:
                    </span>
                    {
                        JSON.stringify(userQuery?.filtros) === '{}' &&
                        <span className="without-filter">—</span>
                    }
                    <div className="question-filters">
                        <ChatQuestionFilter
                            filterName="Tipo de programa"
                            filterValue={userQuery?.filtros?.programType}
                            icon={<GraduationCap height="inherit" />}
                        />
                        <ChatQuestionFilter
                            filterName="Modalidad"
                            filterValue={userQuery?.filtros?.modality}
                            icon={<PersonStanding height="inherit" />}
                        />
                        <ChatQuestionFilter
                            filterName="Sector"
                            filterValue={userQuery?.filtros?.sector}
                            icon={<University height="inherit" />}
                        />
                    </div>
                </ul>
                <ChatQueryOptions
                    isResponding={isResponding}
                    editQuery={editQuery}
                    reloadQuery={reloadQuery}
                    chatRate={chatRate}
                    chatID={chatID}
                    setRating={setRating}
                    rating={rating}
                />
            </div>

            <style jsx>{`
                  
                .wrapper-question {
                    display: grid;
                    justify-content: flex-end;
                }

                .question {
                    padding: 1em;
                    padding-bottom: .5em;
                    border-radius: 12px;
                    background-color: var(--yellow);
                    margin-left: 3em;
                    margin-bottom: 2em;
                    transition: box-shadow .3s;
                    max-width: 22em;
                    min-width: 17em;
                }

                .question-text {
                    margin-bottom: .5em;
                }

                .question-filters-wrapper {
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    gap: .5em;
                }

                .question-filters {
                    display: flex;
                    gap: .5em .5em;
                }

                .question-filters-title {
                    font-weight: 700;
                    margin-bottom: .5em;
                }

                .without-filter {
                    margin-bottom: .5em;
                    font-weight: 600;
                }
                
            `}</style>
        </div>
    )
}

export default ChatQuestion
