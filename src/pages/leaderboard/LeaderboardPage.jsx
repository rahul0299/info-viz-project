import {useStore} from "../../store/use-store.jsx";
import "./leaderboard.css"
import LeaderboardTable from "../../components/LeaderboardTable.jsx";

const LeaderboardPage = () => {
    const { state: { leaderboard } } = useStore();

    return <div className="leaderboard-container">
        {
            leaderboard?.data.length > 0 ?
                <LeaderboardTable data={leaderboard.data} />
            :
                <div className="leaderboard-placeholder">No data available.</div>
        }
    </div>
}

export default LeaderboardPage;