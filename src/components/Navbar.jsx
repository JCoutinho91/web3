import { HiMenuAlt4 } from "react-icons/hi"
import { AiOutlineClose } from "react-icons/ai"
import logo from "../../images/logo.png"
import { useState } from "react"

const NavbarItem = ({ title, classProps }) => {
    return (
        <li className={`mx-4 cursor-pointer ${classProps}`}>
            {title}
        </li>
    )
}

function Navbar() {
    const [toogleMenu, setToogleMenu] = useState(false)


    const navHeadlines = ["Market", "Exchange", "Tutorials", "Wallets"]
    return ( 
        <nav className="w-full flex md:justify-center justify-between item-center p-4">
            <div className="md:flex-[0.5] flex-initial justify-center items-center ">
                <img src={logo} alt="logo" className="w-32 cursor-pointer" />
            </div>
            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
            {navHeadlines.map((item, idx)=>(
             <NavbarItem key={item + idx} title={item}/>
            ))}
            <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546db]">
                Login
            </li>
            </ul>
            <div className="flex relative">
                {toogleMenu
                ? <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToogleMenu(false)} />
                : <HiMenuAlt4 fontSize={28}  className="text-white md:hidden cursor-pointer" onClick={ () =>setToogleMenu(true)}/>
                }
                {toogleMenu && (
                    <ul className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none 
                    flex flex-col just-start item-end rounded - md blue-glassmorphism text-white animate-slide-in
                     ">
                        <li className="text-xl w-full my-2">
                            <AiOutlineClose onClick={() => setToogleMenu(false)}/>
                        </li>
                        {navHeadlines.map((item, idx)=>(
               <NavbarItem key={item + idx} title={item} classProps="my-2 text-lg"/>
               ))}
                    </ul>
                )}
            </div>
            
        </nav>
     );
}

export default Navbar;