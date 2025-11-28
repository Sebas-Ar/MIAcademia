import currency from 'currency.js'

const PlanPrice = ({
    price = 0,
    numberDiscount = 0
}) => {
    return <div className="price-wrapper">
        <span className="price-discount-wrapper">
            <div className="price-discount">
                {currency(price, { precision: 0, separator: '.' }).format()} COP
            </div>
            <span className="discount-tag">
                {numberDiscount}% DTO
                <svg className="colita" viewBox="0 0 21 39" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-93502b43="">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.0808 0C16.5161 0 15.0277 0.67567 13.9977 1.8535L1.34101 16.3268C-0.480869 18.4102 -0.442043 21.5311 1.4311 23.5685L14.0068 37.247C15.034 38.3642 16.4822 39 17.9998 39H20.2725V0L18.0808 0ZM11.361 23.4843C13.5614 23.2888 15.1868 21.3465 14.9912 19.146C14.7957 16.9455 12.8534 15.3202 10.6529 15.5157C8.45245 15.7113 6.82711 17.6536 7.02263 19.8541C7.21815 22.0545 9.16049 23.6799 11.361 23.4843Z" fill="currentColor" data-v-93502b43="">
                    </path>
                </svg>
            </span>
        </span>

        <span className="price">
            {currency(price - (price * (numberDiscount / 100)), { precision: 0, separator: '.' }).format()} <span className='currency'>COP</span>
        </span>

        <style jsx>{`
            .price-wrapper {
                padding-top: .5em;
                display: grid;
                gap: .5em;
            }

            .price-discount-wrapper {
                font-weight: 400;
                position: relative;
                font-size: 1em;
                text-decoration: line-through;
                justify-self: start;
                margin: .5em 0 0;
            }

            .price-discount {
                font-size: 1.2em;
                font-weight: 500;
            }

            .discount-tag {
                font-weight: 600;
                background: var(--dark-blue);
                position: absolute;
                left: calc(100% + 2em);
                top: -1.5em;
                white-space: nowrap;
                padding: .4em .6em .4em .2em;
                border-radius: 0 .5em .5em 0;
                font-size: .75em;
                transform: rotate(-10deg);
                color: var(--white);
            }

            .colita {
                color: var(--dark-blue);
                height: 100%;
                position: absolute;
                right: 95%;
                top: 50%;
                transform: translateY(-50%);
            }

            .price {
                font-weight: 600;
                font-size: 2em;
            }

            .currency {
                font-size: .7em;
            }    
        `}</style>
    </div>
}

export default PlanPrice
