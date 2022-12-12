import Advanced from "./views/Advanced";
import Resume from "./views/Resume";

const ALL_GROUPS = ['A', 'B']
type Group = typeof ALL_GROUPS[number]
const randomGroup = (): Group => ALL_GROUPS[Math.floor(Math.random() * ALL_GROUPS.length)];

const App = () => {
  localStorage.setItem('group',randomGroup());
  return (
    <div>
      <Resume />
      <Advanced />
    </div>
  )
};

export default App
