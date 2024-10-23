
import { useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { IProduct } from "../types/types";

interface ISectionCatalogTop{
    product:IProduct | undefined;
}

const SectionProductItemPageTop = ({product}:ISectionCatalogTop)=>{

    const sectionCatalogTopRef = useRef(null); 

    const onScreen = useIsOnScreen(sectionCatalogTopRef);

    return(
        <section id="sectionCatalogTop" ref={sectionCatalogTopRef} className={onScreen.sectionCatalogTopIntersecting ? "sectionCatalogTop sectionCatalogTop__active" : "sectionCatalogTop"}>
            <div className="container">
                <div className="sectionCatalogTop__inner">
                    <img src="/images/sectionCatalogTop/home-1 1.png" alt="" className="sectionCatalogTop__imgHome" />
                    <img src="/images/sectionCatalogTop/Vector.png" alt="" className="sectionCatalogTop__imgArrow" />
                    <p className="sectionCatalogTop__textGray">Catalog</p>
                    <img src="/images/sectionCatalogTop/Vector.png" alt="" className="sectionCatalogTop__imgArrow" />
                    <p className="sectionCatalogTop__text">{product?.name}</p>
                </div>
            </div>
        </section>
    )
}

export default SectionProductItemPageTop;