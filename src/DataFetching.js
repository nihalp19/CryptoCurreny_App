import React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { stringify } from "postcss"
function DataFetching() {
    const [value, setValue] = useState([])
    const [options, setOptions] = useState([])
    const [price, setPrice] = useState([])
    const [currency, setCurreny] = useState(1)
    const [name, setName] = useState('USD')
    const [searchedValue, setSearchedValue] = useState('')

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get('https://openapiv1.coinstats.app/coins', {
                    headers: {
                        'X-API-KEY': '6EwaVNUQ/AnWNI3uO6kLeYAgMF1qLG2JK2F9D/sae+k=',
                        'accept': 'application/json'
                    }
                })
                const currencySupported = await axios.get('https://openapiv1.coinstats.app/currencies', {
                    headers: {
                        'X-API-KEY': '6EwaVNUQ/AnWNI3uO6kLeYAgMF1qLG2JK2F9D/sae+k=',
                        'accept': 'application/json'
                    }
                })
                const obj = currencySupported.data.result
                setOptions(Object.keys(obj))
                setPrice(Object.values(obj))
                setValue(response.data.result)
                localStorage.setItem('users', JSON.stringify(response.data.result))
                console.log("success");
            }
            catch (err) {
                console.error(err);
            }

        }
        fetchData()

    }, [])

    const handleEvent = (e) => {
        e.preventDefault()
        setCurreny(e.target.value)
        setName(e.target.options[e.target.selectedIndex].getAttribute('data-name'))
        console.log("name", name);
    }

    const handleSearch = (e) => {
        console.log("function call");
        setSearchedValue(e.target.value)

        if (document.querySelector('.bhenchod')?.value.length > 0) {
            console.log('inside if')
            const searchedData = value.filter((v) => {
                return v.name.toLowerCase().includes(searchedValue.toLowerCase());
            })
            setValue(searchedData)
        }
        else {
            console.log('searchedValue.length');
            const Storedata = localStorage.getItem('users')
            let data = JSON.parse(Storedata)
            console.log("data", data);


            setValue(data)
        }
    }
    console.log('search value', document.querySelector('.bhenchod')?.value);
    const style = {
        container: "w-full h-screen flex items-center  flex-col",
        tableContainer: "overflow-x-auto",
        table: "min-w-full",
        th: "p-[20px] text-center ",
        icon: 'w-[30px]',
        flex: 'flex gap-4 justify-center',
        input: 'p-[5px] m-[20px] outline-1 outline-black',
        heading: 'text-4xl'
    }


    return (
        <div className={style.container}>
            <div>
                <input className='bhenchod' style={{margin:'1rem',border: '1px solid black',padding:'5px'}} value={searchedValue} type="text" placeholder="Search..." onChange={(e) => handleSearch(e)} />
                <select name="" id="" onChange={(e) => handleEvent(e)}>
                    {options.length > 0 &&
                        options.map((o, i) => {
                            return <option key={i} value={price[i]} data-name={o} >{o}</option>
                        })
                    }
                </select>
            </div>
            <h1 className={style.heading}>Price in {name}</h1>
            <div className={style.tableContainer}>
                <table className={style.table}>
                    <tr>
                        <th className={style.th}>
                            Rank
                        </th>
                        <th className={style.th}>
                            Name
                        </th>
                        <th className={style.th}>
                            Symbol
                        </th>
                        <th className={style.th}>
                            Market Cap
                        </th>
                        <th className={style.th}>
                            Price
                        </th>
                        <th className={style.th}>
                            Avaliable Supply
                        </th>
                        <th className={style.th}>
                            Volume(24hrs)
                        </th>
                    </tr>
                    {value.length > 0 && (
                        value.map((v, i) => {
                            return <tr key={v.id}>
                                <th className={style.th}>{i + 1}</th>
                                <th className={style.flex}><img className={style.icon} src={v.icon} alt="" /> {v.name}</th>
                                <th className={style.th}>{v.symbol}</th>
                                <th className={style.th}>{v.marketCap * currency}</th>
                                <th className={style.th}>{v.price * currency}</th>
                                <th className={style.th}>{v.availableSupply}</th>
                                <th className={style.th}>{v.volume}</th>
                            </tr>
                        })
                    )}

                </table>
            </div>
        </div>
    )
}

export default DataFetching