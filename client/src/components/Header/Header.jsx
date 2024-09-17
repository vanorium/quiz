import s from './header.module.css'

export default function Header(){
    return(
        <div className={`${s.header} back`}>
            <div className='accent'>Menu</div>
        </div>
    )
}