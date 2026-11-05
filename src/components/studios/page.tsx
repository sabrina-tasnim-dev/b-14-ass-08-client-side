

const StudiosPage = async() => {

    const res=await fetch('http://localhost:5000/studios')
    const data=await res.json()
    console.log(data)

     if (!res.ok) {
    throw new Error("Failed to fetch studios");
  }
  
    return (
        <div>
            
        </div>
    );
};

export default StudiosPage;