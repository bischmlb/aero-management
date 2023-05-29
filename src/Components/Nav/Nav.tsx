import { faCog, faListCheck, faMapLocationDot, faQuestionCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Nav.scss'


export const Nav: React.FC = () => {
    return (
        <div className='nav'>
            <div className='nav-content'>
                <NavItem route={'/'} icon={faMapLocationDot} />
                <NavItem route={'/rules'} icon={faListCheck} />
                <NavItem route={'/settings'} icon={faCog} />
                <NavItem route={'/help'} icon={faQuestionCircle} />
            </div>
        </div>
    )
}




const NavItem: React.FC<{ route: string, icon: IconDefinition }> = ({ route, icon }) => {
    const { pathname } = useLocation()
    const isActive = useMemo(() => pathname === route, [pathname])
    return (
        <Link className={isActive ? 'nav-item-active' : 'nav-item'} to={isActive ? '/' : route} >
            <FontAwesomeIcon icon={icon} />
        </Link>)
}