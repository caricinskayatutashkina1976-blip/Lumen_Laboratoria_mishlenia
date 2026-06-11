import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NextStepRecommendation } from '../components/NextStepRecommendation/NextStepRecommendation';
import { LumenAssistant } from '../components/LumenAssistant/LumenAssistant';
import { LumenAvatar } from '../components/LumenAvatar/LumenAvatar';
import { useAchievementsWithProgress, useProgress } from '../context/ProgressContext';
import { getSortedTopics } from '../data/topics';

export function ProfilePage() {
  const {
    progress,
    setStudentName,
    getTopicProgress,
    isTopicUnlocked,
    topicsMastered,
    missionsCompleted,
    getTrainingFocus,
    getLumenRecommendation,
  } = useProgress();
  const achievements = useAchievementsWithProgress();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const sortedTopics = getSortedTopics();

  const [nameInput, setNameInput] = useState(progress.studentName);
  const [editingName, setEditingName] = useState(false);

  const level = Math.max(1, Math.floor(progress.overallProgress / 20) + 1);
  const levelTitles = ['Новичок', 'Ученик', 'Исследователь', 'Решатель', 'Мастер', 'Эксперт'];
  const levelTitle = levelTitles[Math.min(level - 1, levelTitles.length - 1)];
  const xp = progress.overallProgress * 10;
  const xpToNext = level * 200;
  const xpPercent = Math.min(100, Math.round((xp / xpToNext) * 100));
  const trainingFocus = getTrainingFocus();
  const errorStats = progress.errorStats;
  const lumenRecommendation = getLumenRecommendation('profile');

  function saveName() {
    setStudentName(nameInput);
    setEditingName(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <h1 className="lumen-page-title">Профиль ученика</h1>
        <p className="mt-2 text-sm text-lumen-graphite-light sm:text-base">
          Твой прогресс сохраняется автоматически в этом браузере.
        </p>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="lumen-card p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <LumenAvatar size="md" showLabel={false} />
            <div className="flex-1">
              {editingName ? (
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="rounded-xl border border-lumen-silver-light px-3 py-2 text-sm outline-none focus:border-lumen-teal/50"
                  />
                  <button type="button" onClick={saveName} className="lumen-btn-primary py-2">
                    Сохранить
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-lumen-graphite">
                    {progress.studentName}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditingName(true)}
                    className="mt-1 text-xs text-lumen-blue hover:underline"
                  >
                    Изменить имя
                  </button>
                </>
              )}
              <p className="mt-2 text-sm text-lumen-teal">
                Уровень {level} — {levelTitle}
              </p>

              <div className="mt-5">
                <div className="mb-1.5 flex justify-between text-xs text-lumen-silver">
                  <span>Общий прогресс</span>
                  <span>{progress.overallProgress}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-lumen-silver-light">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-lumen-blue to-lumen-teal"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-lumen-bg px-4 py-3">
              <p className="text-xs text-lumen-silver">Миссии</p>
              <p className="text-lg font-semibold text-lumen-graphite">{missionsCompleted}</p>
            </div>
            <div className="rounded-xl bg-lumen-bg px-4 py-3">
              <p className="text-xs text-lumen-silver">Тем освоено</p>
              <p className="text-lg font-semibold text-lumen-graphite">{topicsMastered}</p>
            </div>
            <div className="rounded-xl bg-lumen-bg px-4 py-3">
              <p className="text-xs text-lumen-silver">Достижения</p>
              <p className="text-lg font-semibold text-lumen-graphite">{unlockedCount}</p>
            </div>
          </div>
        </section>

        <section className="lumen-card border-lumen-teal/25 bg-gradient-to-br from-lumen-surface to-lumen-teal-soft/20 p-6">
          <p className="lumen-section-label">Звание</p>
          <h3 className="mt-2 text-lg font-semibold text-lumen-graphite">{levelTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-lumen-graphite-light">
            Решено задач: {progress.solvedProblems.length}. Уроков пройдено:{' '}
            {progress.completedLessons.length}.
          </p>
          <Link
            to="/achievements"
            className="mt-4 inline-block text-sm font-medium text-lumen-teal hover:underline"
          >
            Все достижения →
          </Link>
        </section>
      </div>

      <section className="mb-8 lumen-card border-l-4 border-lumen-blue p-5 sm:p-6">
        <p className="lumen-section-label">С чем сейчас тренируемся</p>
        <ul className="mt-4 space-y-3">
          {trainingFocus.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-3 text-sm leading-relaxed text-lumen-graphite-light sm:text-base"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-lumen-blue-soft text-xs font-semibold text-lumen-blue">
                {index + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
        {errorStats && errorStats.selfFixedCount > 0 && (
          <p className="mt-4 text-sm text-lumen-teal">
            Исправлено ошибок самостоятельно: {errorStats.selfFixedCount}
          </p>
        )}
      </section>

      <section className="mb-8">
        <p className="lumen-section-label mb-4">Рекомендация Люмена</p>
        <NextStepRecommendation recommendation={lumenRecommendation} />
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-lumen-graphite">Карта тем</h2>
          <Link to="/map" className="text-sm text-lumen-blue hover:underline">
            Полная карта →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTopics.map((topic) => {
            const topicProgress = getTopicProgress(topic.id);
            const unlocked = isTopicUnlocked(topic.id);

            return (
              <Link
                key={topic.id}
                to={unlocked ? `/lesson/${topic.slug}` : '/map'}
                className={`lumen-card px-4 py-4 transition-colors ${
                  unlocked ? 'hover:border-lumen-teal/30' : 'opacity-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-lumen-graphite">{topic.title}</span>
                  <span className="text-xs text-lumen-teal">{topicProgress}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-lumen-silver-light">
                  <div
                    className="h-full rounded-full bg-lumen-teal"
                    style={{ width: `${topicProgress}%` }}
                  />
                </div>
                {topicProgress >= 70 && (
                  <p className="mt-2 text-xs font-medium text-lumen-teal">Тема освоена</p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <LumenAssistant
        compact
        greeting="Ты не просто получил ответ. Ты понял ход решения. Продолжай в том же темпе."
        avatarSize="sm"
      />
    </div>
  );
}
