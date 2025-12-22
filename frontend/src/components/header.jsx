import { Link } from "react-router-dom";

export default function Header(){
    const getCustomer=localStorage.getItem("customer")

    const  handleLogout=()=>{
        localStorage.clear()
    }

    return <div className="bg-white text-gray-700 py-3 px-6 flex justify-between border-b items-center">
        <Link to="/"><h1 className="font-bold text-3xl text-slate-900">Gatitaa</h1></Link>
        <ul className="flex gap-6 items-center text-xl font-medium cursor-pointer">
            <Link to="/"><li className="hover:text-yellow-300">Home</li></Link>
           <Link to="/about"> <li className="hover:text-yellow-300">About</li></Link>
            <li className="hover:text-yellow-300">Category</li>
            <li className="hover:text-yellow-300">Contact</li>
        </ul>
        <div className="flex gap-4">
            {
                getCustomer ?     <div className="flex gap-2 items-center">
                <div>
                    <h1 className="bg-yellow-500 w-10 h-10 rounded-full text-black text-center text-2xl pt-1 cursor-pointer font-semibold">{JSON.parse(getCustomer).data?.customer.name[0]}</h1>
                </div>
                <Link to="/login"><button onClick={handleLogout} className="px-8 py-2 rounded-lg border-[#80A3CB] border hover:bg-[#d6e5f5] font-medium text-black"><i className="fa-solid fa-user text-gray-400 text-xl "></i>LogOut</button></Link>
            </div>
            : <div className="flex gap-2 items-center"> <Link to='/login'><button className="px-8 py-2 rounded-lg border-yellow-400 border font-medium hover:bg-orange-50 text-black flex gap-2 items-center"><i className="fa-solid fa-user text-gray-400 text-xl "></i>Login</button></Link>
            <Link to="/customerRegis"><button className="px-8 py-2 rounded-lg border-[#80A3CB] border hover:bg-[#d6e5f5] font-medium text-black">Register customer</button></Link>
                    </div> 
            }
           
            <Link to="/cart"><button className="px-8 py-3 rounded-lg  font-medium  bg-orange-100 text-black hover:bg-yellow-400 hover:text-white"><i className=" fa-solid fa-shopping-cart"></i>AddCart</button></Link>
        </div>
    </div>
}