import { useAtom } from 'jotai';
import ProfileFillIcon from '../../assets/profile-fill.svg';
import Layout from "../../components/Layout";
import { setSettingsLocalStorage, settingsAtom } from '../../store/settings';

export default function Settings(props:{}){
    const [settings,setSettings] = useAtom(settingsAtom);

    const _handleSuggestionChange = (e:any) => {
        const currentSettings = settings;
        setSettings(prev => ({...prev, suggested: e.target.value}));
        setSettingsLocalStorage({...currentSettings, suggested: e.target.value});
    };

    const _handleBlacklistChange = (e:any) => {
        const currentSettings = settings;
        setSettings(prev => ({...prev, blacklist: e.target.value.split(',')}));
        setSettingsLocalStorage({...currentSettings, blacklist: e.target.value.split(',')});
    };

    return(
        <Layout className="settings-page">
            <div className="col-header">
                <h1>Settings</h1>
            </div>
            <section className='section'>
                <div className="section-icon">
                    <img src={ProfileFillIcon} alt="" />
                </div>
                <h2>Suggested Follows:</h2>
                <div className="radio">
                    <input title="Global" type="radio" name="suggested-method" value="global" onChange={_handleSuggestionChange} checked={settings.suggested == 'global'} />
                    <label>
                        <strong>Global</strong>
                    </label>
                </div>
                <div className="radio">
                    <input title="Personalized" type="radio" name="suggested-method" value="personalized" onChange={_handleSuggestionChange} checked={settings.suggested == 'personalized'} />
                    <label>
                        <strong>Personalized</strong>
                    </label>
                </div>
            </section>
            <section className='section'>
                <div className="section-icon">
                    <img src={ProfileFillIcon} alt="" />
                </div>
                <h2>Blacklist:</h2>
                <p>You won't see these anywhere, whether these keywords are in a post or in someones name. Separate them using comma (,) .</p>
                <div className="input-wrapper">
                    <textarea placeholder="Seperate with , ex: abi,user" value={settings.blacklist.join(',')} onChange={_handleBlacklistChange}></textarea>
                </div>
            </section>
        </Layout>
    );
}