import { Link } from 'react-router-dom';
import { AchievementCard } from '../components/AchievementCard/AchievementCard';
import { useAchievementsWithProgress, useProgress } from '../context/ProgressContext';

export function AchievementsPage() {
  const achievements = useAchievementsWithProgress();
  const { missionsCompleted, topicsMastered, progress } = useProgress();
  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  const level = Math.max(1, Math.floor(progress.overallProgress / 20) + 1);
  const levelTitles = ['Новичок', 'Ученик', 'Исследователь', 'Решатель', 'Мастер', 'Эксперт'];
  const levelTitle = levelTitles[Math.min(level - 1, levelTitles.length - 1)];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <h1 className="lumen-page-title">Достижения</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
          Современная система прогресса без медалек и мультяшных наград. Поощряем
          внимательность, попытки и спокойное рассуждение — не только правильный ответ.
        </p>
      </div>

      <section className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="lumen-card p-5">
          <p className="text-xs text-lumen-silver">Уровень</p>
          <p className="mt-1 text-2xl font-bold text-lumen-graphite">{level}</p>
          <p className="text-sm text-lumen-teal">{levelTitle}</p>
        </div>
        <div className="lumen-card p-5">
          <p className="text-xs text-lumen-silver">Открыто достижений</p>
          <p className="mt-1 text-2xl font-bold text-lumen-graphite">
            {unlocked.length} / {achievements.length}
          </p>
        </div>
        <div className="lumen-card p-5">
          <p className="text-xs text-lumen-silver">Тем освоено</p>
          <p className="mt-1 text-2xl font-bold text-lumen-graphite">{topicsMastered}</p>
          <p className="text-xs text-lumen-silver">{missionsCompleted} миссий</p>
        </div>
      </section>

      {unlocked.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-lumen-graphite">Полученные</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unlocked.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </section>
      )}

      {locked.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-lumen-graphite">Ещё впереди</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locked.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 text-center">
        <Link to="/profile" className="text-sm font-medium text-lumen-blue hover:underline">
          Перейти в профиль →
        </Link>
      </div>
    </div>
  );
}
