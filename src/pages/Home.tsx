import { Link } from "react-router-dom"
import { FiPlus } from "react-icons/fi"
import { IconContext } from "react-icons"

import List from "../components/home/List"

function Home() {
    return (
        <div className="max-w-[1212px] mx-auto">
            <div className="flex items-center justify-between">
                <b className="text-[24px]">Products</b>
                <div>
                    <Link to='/add' className="add">
                        <IconContext.Provider value={{ className: "text-[24px]" }}>
                            <FiPlus />
                        </IconContext.Provider>
                        <span>Add Product</span>
                    </Link>
                </div>
            </div>

            <div className="mt-5">
                <List />
            </div>
        </div >
    )
}

export default Home