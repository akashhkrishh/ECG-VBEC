import { LoaderPinwheel } from 'lucide-react'
import React from 'react'

type Props = {}

const NavBar = (props: Props) => {
  return (
    <header>
        <nav className='border-b w-full'>
            <ul className='w-full flex items-center justify-center p-4 gap-4'>
                {/* <li className='text-yellow-500 flex gap-1 items-center justify-center'> 
                    <LoaderPinwheel className='animate-spin' size={14}/>
                    <span>Connecting</span>
                </li> */}
                <li className='text-green-500 flex gap-1 items-center justify-center'> 
                    <LoaderPinwheel className='' size={14}/>
                    <span>Connected</span>
                </li>
            </ul>
        </nav>
    </header>
  )
}

export default NavBar