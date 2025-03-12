import {useCurrentApp} from "components/context/app.context.tsx";

const AppHeader = () => {
    const { user } = useCurrentApp();
    return (
        <div>
            app header
            <div>
                {JSON.stringify(user)}
            </div>
    </div>
)
}

export default AppHeader;