import { useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const SectionBrands = ()=>{

    const sectionBrandsRef = useRef(null); 

    const onScreen = useIsOnScreen(sectionBrandsRef);

    return(
        <section id="sectionBrands" ref={sectionBrandsRef} className={onScreen.sectionBrandsIntersecting ? "sectionBrands sectionBrands__active" : "sectionBrands"}>
            <div className="container">
                <div className="sectionBrands__inner">
                    <div className="sectionBrands__item">
                        <img src="/images/sectionBrands/Vector.png" alt="" className="sectionBrands__item-img" />
                    </div>
                    <div className="sectionBrands__item">
                        <img src="/images/sectionBrands/mango-1.png" alt="" className="sectionBrands__item-img" />
                    </div>
                    <div className="sectionBrands__item">
                        <img src="/images/sectionBrands/Group.png" alt="" className="sectionBrands__item-img" />
                    </div>
                    <div className="sectionBrands__item">
                        <img src="/images/sectionBrands/food.png" alt="" className="sectionBrands__item-img" />
                    </div>
                    <div className="sectionBrands__item">
                        <img src="/images/sectionBrands/bookoff-corporation-logo.png" alt="" className="sectionBrands__item-img" />
                    </div>
                    <div className="sectionBrands__itemLast">
                        <img src="/images/sectionBrands/Group (1).png" alt="" className="sectionBrands__item-img" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionBrands;