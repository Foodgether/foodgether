
interface CardMenuProps {
  name: string;
  image: string;
  price: number;
}

const Card = (props: CardMenuProps) => {
  const {name, price, image} = props
  return <div
    className="flex flex-row max-w-2xl bg-white border border-gray-200 shadow-md dark:bg-slate-50 dark:border-gray-700 p-5">
    <img className="rounded-t-lg object-contain" src={image} alt=""/>
    <div className="p-5 grow">
      <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-stone-900">{name}</h5>
      <p className="mb-3 font-medium text-gray-900 dark:text-gray-400">{price}</p>
      <button
         className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-orange-600 rounded-lg hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-orange-600 dark:hover:bg-white dark:hover:text-slate-900 dark:border-2 dark:hover:border-slate-900 dark:focus:ring-blue-800">
        Order
        <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  </div>
}

export default Card;
