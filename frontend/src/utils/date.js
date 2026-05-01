
// Date utilis

export const formatDateTime = (iso) => {
    const d = new Date(iso);
    console.log(d)

    const date = d.toLocaleDateString('en-IN',{
        day:'2-digit',
        month:'short',
        year:"numeric"
    })

    const time = d.toLocaleTimeString('en-IN',{
        hour:'2-digit',
        minute:'2-digit',
        hour12:true
    })

    console.log(`"DATE": ${date} - "TIME": ${time}`)

    return{
        date:date,time:time
    }
}