import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function TestPage() {

    const [show, setShow] = useState(false);
    const [number, setNumber] = useState(0)




    return (
        <main className="min-h-screen justify-center items-center flex-col flex  ">

            <div className="flex gap-8">

                {/*hover without parent container */}
                <Card className={`bg-blue-800 h-40 w-40 hover:-translate-y-8 duraion-300 flex-1 hover:duration-300  ${show && "border-gray-300 border-4"}`}></Card>

                {/*hover with parent container */}
                <div className={`group rounded-3xl ${show && "border-gray-300 border-4"}`}>
                    <Card className={`bg-blue-800 h-40 w-40 group-hover:-translate-y-8 duraion-300 flex-1 group-hover:duration-300`}></Card>
                </div>

            </div>


            <div className="mt-8 space-x-2">
                <Checkbox id="show-border" checked={show} onCheckedChange={() => setShow(!show)} defaultChecked={!show} />
                <label htmlFor="show-border">Show Hover Area</label>
            </div>

            {number}

            <Button onClick={() => {
                setNumber((prev) => {
                    prev += 1;
                    prev += 1;
                    prev += 1;

                    return prev;
                });

            }}>
                click me
            </Button>



        </main >
    )
}
