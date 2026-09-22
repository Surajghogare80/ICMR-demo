// src/pages/Explore/ExploreIcon.jsx
// Resolves the icon name strings used in exploreData.js to actual MUI icon
// components, so exploreData.js can stay plain data (no JSX/imports there).
import MenuBook from '@mui/icons-material/MenuBook';
import HelpOutline from '@mui/icons-material/HelpOutline';
import ReportProblem from '@mui/icons-material/ReportProblem';
import Checklist from '@mui/icons-material/Checklist';
import FactCheck from '@mui/icons-material/FactCheck';
import Biotech from '@mui/icons-material/Biotech';
import MonitorHeart from '@mui/icons-material/MonitorHeart';
import Assessment from '@mui/icons-material/Assessment';
import QuestionAnswer from '@mui/icons-material/QuestionAnswer';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Cyclone from '@mui/icons-material/Cyclone';
import EventNote from '@mui/icons-material/EventNote';
import PregnantWoman from '@mui/icons-material/PregnantWoman';
import Bloodtype from '@mui/icons-material/Bloodtype';
import LocalHospital from '@mui/icons-material/LocalHospital';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import EventBusy from '@mui/icons-material/EventBusy';
import WaterDrop from '@mui/icons-material/WaterDrop';
import Timeline from '@mui/icons-material/Timeline';
import Science from '@mui/icons-material/Science';
import Medication from '@mui/icons-material/Medication';
import Sick from '@mui/icons-material/Sick';
import Face from '@mui/icons-material/Face';
import Healing from '@mui/icons-material/Healing';
import ContentCut from '@mui/icons-material/ContentCut';
import AutoFixHigh from '@mui/icons-material/AutoFixHigh';
import Spa from '@mui/icons-material/Spa';
import FlashOn from '@mui/icons-material/FlashOn';
import MedicalServices from '@mui/icons-material/MedicalServices';
import SelfImprovement from '@mui/icons-material/SelfImprovement';
import HealthAndSafety from '@mui/icons-material/HealthAndSafety';
import Favorite from '@mui/icons-material/Favorite';
import WarningAmber from '@mui/icons-material/WarningAmber';
import Restaurant from '@mui/icons-material/Restaurant';
import Bedtime from '@mui/icons-material/Bedtime';
import TaskAlt from '@mui/icons-material/TaskAlt';
import MonitorWeight from '@mui/icons-material/MonitorWeight';
import DirectionsRun from '@mui/icons-material/DirectionsRun';
import Groups from '@mui/icons-material/Groups';
import Handshake from '@mui/icons-material/Handshake';
import Forum from '@mui/icons-material/Forum';
import People from '@mui/icons-material/People';
import SupportAgent from '@mui/icons-material/SupportAgent';
import EmojiEmotions from '@mui/icons-material/EmojiEmotions';
import SentimentSatisfied from '@mui/icons-material/SentimentSatisfied';
import Bolt from '@mui/icons-material/Bolt';
import LocalDining from '@mui/icons-material/LocalDining';
import FitnessCenter from '@mui/icons-material/FitnessCenter';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Flag from '@mui/icons-material/Flag';

const ICONS = {
  MenuBook, HelpOutline, ReportProblem, Checklist, FactCheck, Biotech, MonitorHeart,
  Assessment, QuestionAnswer, FavoriteBorder, Cyclone, EventNote, PregnantWoman,
  Bloodtype, LocalHospital, CalendarMonth, EventBusy, WaterDrop, Timeline, Science,
  Medication, Sick, Face, Healing, ContentCut, AutoFixHigh, Spa, FlashOn,
  MedicalServices, SelfImprovement, HealthAndSafety, Favorite, WarningAmber,
  Restaurant, Bedtime, TaskAlt, MonitorWeight, DirectionsRun, Groups, Handshake,
  Forum, People, SupportAgent, EmojiEmotions, SentimentSatisfied, Bolt, LocalDining,
  FitnessCenter, CheckCircle, Flag,
};

const ExploreIcon = ({ name, ...props }) => {
  const Icon = ICONS[name] || HelpOutline;
  return <Icon {...props} />;
};

export default ExploreIcon;
