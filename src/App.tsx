import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { AchievementsPage } from './pages/AchievementsPage';
import { HomePage } from './pages/HomePage';
import { LessonPage } from './pages/LessonPage';
import { ProblemPage } from './pages/ProblemPage';
import { ProfilePage } from './pages/ProfilePage';
import { TopicMapPage } from './pages/TopicMapPage';
import { TopicsPage } from './pages/TopicsPage';
import { WhyNeedItPage } from './pages/WhyNeedItPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="map" element={<TopicMapPage />} />
          <Route path="topics" element={<TopicsPage />} />
          <Route path="lesson/:topicSlug" element={<LessonPage />} />
          <Route path="problem/:problemId" element={<ProblemPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="why/:topicSlug" element={<WhyNeedItPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
