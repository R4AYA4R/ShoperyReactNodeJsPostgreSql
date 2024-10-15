import { useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const SectionCatalogTop = ()=>{

    const sectionCatalogTopRef = useRef(null); 

    const onScreen = useIsOnScreen(sectionCatalogTopRef);

    return(
        <section id="sectionCatalogTop" ref={sectionCatalogTopRef} className={onScreen.sectionCatalogTopIntersecting ? "sectionCatalogTop sectionCatalogTop__active" : "sectionCatalogTop"}>
            <div className="container">
                <div className="sectionCatalogTop__inner">
                    <img src="/images/sectionCatalogTop/home-1 1.png" alt="" className="sectionCatalogTop__imgHome" />
                    <img src="/images/sectionCatalogTop/Vector.png" alt="" className="sectionCatalogTop__imgArrow" />
                    <p className="sectionCatalogTop__text">Catalog</p>
                </div>
            </div>
        </section>
    )
}

export default SectionCatalogTop;