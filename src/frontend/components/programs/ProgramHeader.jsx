import AdsMain from '../ads/AdsMain'

import ProgramTags from './ProgramTags'

import ProgramAccreditation from './ProgramAccreditation'
import ProgramDescription from './ProgramDescription'
import ProgramHeaderInsitute from './ProgramHeaderInsitute'
import ProgramItemList from './ProgramItemList'
import ProgramType from './ProgramType'

const ProgramHeader = ({
    program = {}
}) => {
    return (
        <header className={`z-1 mx-4 px-4 ${
            process.env.NEXT_PUBLIC_ENABLE_ADS === 'true'
                ? 'pb-[6em]'
                : 'pb-[7em]'
        } pt-[1.4em] grid justify-items-center bg-(--light-blue) relative gap-[2em] border-t-[1em] border-white rounded-t-[4em] rounded-b-[2em] transition-[padding] duration-300`}>

            <ProgramHeaderInsitute program={program} />

            <h1 className="max-w-[20em] text-[1.9em] opacity-100 uppercase text-center font-normal -mt-2 mb-[0.4em]">
                {program?.instituteName}
            </h1>

            <ProgramTags program={program}/>

            <div className="h-[0.15em] max-w-[20em] w-1/2 rounded-2xl bg-(--gray)"></div>

            <ProgramType program={program} />

            <ProgramItemList
                program={program}
            />

            <ProgramDescription
                program={program}
            />

            <ProgramAccreditation
                program={program}
            />

            <AdsMain />
        </header>
    )
}

export default ProgramHeader
