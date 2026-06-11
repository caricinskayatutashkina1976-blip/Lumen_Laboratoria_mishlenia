import { Link } from 'react-router-dom';
import { LumenAssistant } from '../components/LumenAssistant/LumenAssistant';
import { LumenAvatar } from '../components/LumenAvatar/LumenAvatar';
import { TodayMission } from '../components/TodayMission/TodayMission';
import { getSortedTopics } from '../data/topics';

const quickTopics = [
  { slug: 'text-problems', label: 'Текстовые задачи' },
  { slug: 'fractions', label: 'Дроби' },
  { slug: 'percents', label: 'Проценты' },
  { slug: 'motion', label: 'Задачи на движение' },
  { slug: 'area-perimeter', label: 'Площадь и периметр' },
];

export function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="mb-10">
        <div className="lumen-card overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lumen-teal via-lumen-blue to-lumen-teal" />
          <div className="grid gap-8 p-6 sm:grid-cols-[auto_1fr] sm:p-10">
            <div className="flex justify-center sm:justify-start">
              <LumenAvatar size="xl" />
            </div>
            <div className="text-center sm:text-left">
              <p className="lumen-section-label">Образовательная платформа</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-lumen-graphite sm:text-4xl lg:text-5xl">
                Люмен. Лаборатория решений
              </h1>
              <p className="mt-3 text-lg text-lumen-blue sm:text-xl">
                Понять, а не заучить
              </p>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-lumen-graphite-light sm:mx-0 sm:text-base">
                AI-наставник помогает разбирать сложные темы простыми словами — через
                вопросы, схемы и пошаговое рассуждение.
              </p>
              <p className="mt-4 text-sm italic text-lumen-silver">
                «Привет. Я Люмен. Давай разбираться спокойно и по шагам.»
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-10">
        <TodayMission />
      </div>

      <div className="mb-10">
        <LumenAssistant greeting="Привет. Я Люмен. Давай разбираться спокойно и по шагам." />
      </div>

      <section className="mb-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-lumen-graphite sm:text-2xl">
              Выбери тему
            </h2>
            <p className="mt-1 text-sm text-lumen-silver">
              Или открой полную карту обучения
            </p>
          </div>
          <Link to="/map" className="hidden text-sm font-medium text-lumen-blue hover:underline sm:inline">
            Карта тем
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickTopics.map((topic) => (
            <Link
              key={topic.slug}
              to={`/lesson/${topic.slug}`}
              className="lumen-card group flex items-center justify-between px-6 py-5 transition-all hover:border-lumen-teal/30 hover:shadow-[0_12px_40px_rgba(30,41,59,0.1)]"
            >
              <span className="font-medium text-lumen-graphite transition-colors group-hover:text-lumen-blue">
                {topic.label}
              </span>
              <span className="text-lumen-silver transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          ))}

          <Link
            to="/topics"
            className="group flex items-center justify-between rounded-2xl border border-dashed border-lumen-blue/40 bg-lumen-blue-soft/30 px-6 py-5 transition-all hover:bg-lumen-blue-soft/50 sm:col-span-2 lg:col-span-1"
          >
            <span className="font-medium text-lumen-blue">Я не понял тему</span>
            <span className="text-lumen-blue/60 transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>

      <section className="lumen-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-lumen-graphite">Все темы курса</h2>
        <p className="mt-1 text-sm text-lumen-silver">
          {getSortedTopics().length} тем для 5–6 класса
        </p>
        <Link to="/map" className="lumen-btn-primary mt-4 inline-flex">
          Открыть карту тем
        </Link>
      </section>
    </div>
  );
}
