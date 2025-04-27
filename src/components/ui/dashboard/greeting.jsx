import { useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { getGreeting } from "@/utils/utils";


export default function Greeting() {
  const [currentDate, setCurrentDate] = useState("");
  const { name, role } = authService.getAuthenticatedUser();

  useEffect(() => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-US', options));
  }, []);

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-xl md:text-2xl text-gray-800">
          {getGreeting(name)}{" "}
          <p className="text-brand-500 text-sm inline-block">{role}</p>
        </h2>
        
        <p className="text-gray-500">{currentDate}</p>
      </div>
    </div>
  );
}
