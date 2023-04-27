import cn from 'classnames';
import { useEffect, useState } from 'react';
import store from 'store';
import MoonIcon from '../../assets/moon.svg';
import SunIcon from '../../assets/sun.svg';
import styles from './ThemeToggle.module.scss';

export default function ThemeToggle(props: {}) {
    const localStorageTheme = store.get("theme") || "light";
    const [isDark, setIsDark] = useState(localStorageTheme == "dark");
    const [className, setClassName] = useState("");

    const _changeTheme = (e: any) => {
        e.preventDefault();

        setClassName(cn({ [styles.dark]: isDark ? false : true }));
        store.set("theme", isDark ? "light" : "dark");
        document.body.classList.remove("light");
        document.body.classList.remove("dark");
        document.body.classList.add(isDark ? "light" : "dark");
        setIsDark(prev => !prev);
    };

    useEffect(() => {
        document.body.classList.add(localStorageTheme);
        setClassName(cn({ [styles.dark]: isDark }));
    }, []);

    return (
        <a href="#" title="Theme Toggle" target="_self" className={cn("theme-toggle", styles['theme-toggle'], className)} onClick={_changeTheme}>
            <div className={styles['theme-toggle__inner']}>
                <img src={SunIcon} alt=""/>
                <img src={MoonIcon} alt=""/>
            </div>
        </a>
    );
}