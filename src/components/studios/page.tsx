

import { Studio } from "@/types/studio";
import { StudioGrid } from "./studio-grid";
import { studios } from "@/data/studios";

const StudiosPage = async() => {

    const res=await fetch('http://localhost:5000/studios')
    const data=await res.json()
    console.log(data)

     if (!res.ok) {
    throw new Error("Failed to fetch studios");
  }
  const studios: Studio[] = data.map(
    (studio: Studio & { _id: string }) => ({
      ...studio,
      id: studio._id,
    })
  );
    return (
        <div>
            <StudioGrid studios={studios}/>
        </div>
    );
};

export default StudiosPage;