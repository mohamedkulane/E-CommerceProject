export default function Hero(){
    return <div className="flex justify-around px mt-16 border-b pb-6">
        <div className="w-[45%] space-y-10">
            <h1 className="text-4xl font-semibold ">Discover every Needs you have we are ready to support you</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam facere incidunt est? Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            <div className="flex gap-5 items-center">
            <button className="bg-yellow-400 text-white px-12 rounded-full py-3 font-medium">Shop Now</button>
            <button className="bg-yellow-100 text-black px-12 rounded-lg py-3 font-medium">Browse categories</button>
        </div>
        </div>
        <div>
            <img className="w-[420px] h-96 rounded-md" src="https://i.pinimg.com/736x/af/0f/10/af0f1098bf13ff946e0d54f43154f1f8.jpg" alt="" />
        </div>
        
    </div>
}