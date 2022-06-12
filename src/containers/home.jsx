import { Navigation } from "../components/navigation";
import { Header } from "../components/header";
import { Features } from "../components/features";
import { About } from "../components/about";
import { Team } from "../components/Team";
import { Contact } from "../components/contact";
import JsonData from "../data/data.json";
import { useEffect, useState } from "react";

const Home = (props) => {

    const [landingPageData, setLandingPageData] = useState({});
    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);
    return (
        <div>
            <Navigation />
            <Header data={landingPageData.Header} />
            <Features data={landingPageData.Features} setSelectedFile={props.setSelectedFile} />
            <About data={landingPageData.About} />
            {/* <Gallery data={landingPageData.Gallery} /> */}
            <Team data={landingPageData.Team} />
            <Contact data={landingPageData.Contact} />
        </div>
    );
}

export default Home;