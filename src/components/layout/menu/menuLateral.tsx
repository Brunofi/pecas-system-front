/*import Link from "next/link";

export const Menu:React.FC = () => {
    return(
        <aside className="column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile">
            <p className="menu-label is-hidden-touch">
                Parts System
            </p>
            <ul className="menu-list">
               <MenuItem href="/" label="Cadastros"/>
               <MenuItem href="/" label="Orçamentos"/>
               <MenuItem href="/" label="Lançamentos"/>
            </ul>

        </aside>

    )

}

interface MenuItemProps{
    href:string;
    label:string;
}

const MenuItem: React.FC<MenuItemProps> = (props: MenuItemProps) => {
    return(
        <li>
            <Link  href={props.href}>
                <span className="icon"></span>{props.label}
            </Link>
        </li>
    )
}



/*
export const Menu:React.FC = () => {
    return(
        
    )

}
*/