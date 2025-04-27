import { Outlet, useOutletContext } from "react-router-dom";

export default function QuizLayout() {
  const classroom = useOutletContext()
  return (
    <div>
      <Outlet context={classroom}/>
    </div>
  )
}