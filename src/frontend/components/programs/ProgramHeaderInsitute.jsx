'use client'

import { useEffect, useRef } from 'react'

import { useFavoritesStore } from '@/frontend/hooks/globalState/useFavoriteStore'
import { useIdentifyUser } from '@/frontend/hooks/useIdentifyUser'
import FavoriteBtn from '../chat/ChatActionsBar/FavoriteBtn'
import BtnShare from './BtnShare'

import Color from 'color-thief-react'
import ColorThief from 'colorthief'

const ProgramHeaderInsitute = ({ program }) => {
    const { anonimousUserID, userEmail } = useIdentifyUser()

    const universityImg = useRef(null)

    useEffect(() => {
        fetchFavorites({ userEmail })
    }, [userEmail])

    useEffect(() => {
        if (universityImg.current) {
            universityImg.current.onload = () => {
                const colorThief = new ColorThief()
                const color = colorThief.getColor(universityImg.current)
                console.log(color)
            }
        }
    }, [])

    const fetchFavorites = useFavoritesStore(state => state.fetchFavorites)
    return (
        <Color src={program?.urlImg || '/logo-not-found.webp'} format="hex" crossOrigin='anonymous'>
            {
                ({ data, loading, error }) => (
                    <>
                        <div
                            className="absolute top-0 left-0 h-[7em] w-full bg-(--light-blue) rounded-t-[2em]"
                            style={{
                                backgroundColor: !data ? 'var(--light-gray)' : data
                            }}
                        >
                            <div className="absolute left-1/2 top-full -translate-x-[13em] -translate-y-1/2">
                                <BtnShare />
                            </div>
                            <div className="absolute right-1/2 top-full translate-x-[13em] -translate-y-1/2">
                                <FavoriteBtn
                                    programID={String(program?.programID)}
                                    userEmail={userEmail}
                                    anonimousUserID={anonimousUserID}
                                />
                            </div>
                        </div>
                        <img
                            className="object-contain bg-white rounded-[2em] border-[0.5em] border-(--light-blue) h-[14em] w-[14em] p-[.5em] opacity-100 z-10"
                            src={program?.urlImg || '/logo-not-found.webp'}
                            alt={program?.programName}
                            style={{ borderColor: !data ? 'var(--light-gray)' : data }}
                        />
                    </>
                )
            }
        </Color>
    )
}

export default ProgramHeaderInsitute
