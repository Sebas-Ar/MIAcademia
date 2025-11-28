import { useForm } from 'react-hook-form'
import readXlsxFile from 'read-excel-file'

const UpdateDB = () => {
    const { register, handleSubmit } = useForm()

    const uploadDB = async (formData) => {
        await readXlsxFile(formData.file[0]).then((rows) => {
            console.log(rows)
        })
    }

    return (
        <form className="container" onSubmit={handleSubmit(uploadDB)}>
            <h1>hola</h1>
            <label>
                <span>Upload a Excel file</span>
                <input type="file" {...register('file')}/>
            </label>

            <button type="submit">Actualizar</button>

            <style jsx>{`
                .container {
                    
                }
            `}</style>
        </form>
    )
}

export default UpdateDB
