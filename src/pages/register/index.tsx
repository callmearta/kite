import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import store from 'store';
import agent from "../../Agent";
import KiteLogo from '../../assets/kite.png';
import Button from "../../components/Button";

export default function Register(props: {}) {
    const [form, setForm] = useState({
        email: '',
        password: '',
        handle: '',
        inviteCode: '',
        loading: false,
        error: null
    });
    const theme = store.get("theme");
    const navigate = useNavigate();

    useEffect(() => {
        if (theme == 'dark') {
            document.body.classList.add('dark');
        }
    }, []);

    const _handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!form.email.length || !form.password.length) return;
        setForm(prev => ({ ...prev, loading: true }));
        try {
            const result = await agent.createAccount({
                // identifier: form.identifier.includes(".") ? form.identifier : `${form.identifier}.bsky.social`,
                email: form.email,
                password: form.password,
                handle: form.handle,
                inviteCode: form.inviteCode
            });
            if (result.success) {
                navigate("/");
            }

        } catch (err: any) {
            console.error(err.message);
            setForm(prev => ({ ...prev, error: err.message, loading: false }));
        }
    }

    return (
        <div className="login-page">
            <img src={KiteLogo} alt="Kite | A Better BlueSky Client" />
            <h1>Kite</h1>
            <h2>Better BlueSky Client</h2>
            <form onSubmit={_handleSubmit}>
                <div className="input-wrapper">
                    <input type="text" placeholder="Invite Code" value={form.inviteCode} onChange={e => setForm(prev => ({ ...prev, inviteCode: e.target.value }))} />
                </div>
                {!form.inviteCode.length ? '' :
                    <>
                        <div className="input-wrapper">
                            <input type="text" placeholder="Handle ( it's like username )" value={form.handle} onChange={e => setForm(prev => ({ ...prev, handle: e.target.value }))} />
                        </div>
                        <div className="input-wrapper">
                            <input type="email" placeholder="Email address" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} />
                        </div>
                        <div className="input-wrapper">
                            <input type="password" placeholder="Password" value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} />
                        </div>
                        <Button text="Create Account" className="btn" loading={form.loading} />
                        {form.error ? <p className="error text-center">{form.error}</p> : ''}
                    </>}
            </form>
        </div>
    );
}