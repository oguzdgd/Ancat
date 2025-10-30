'use client'

import { Survey } from './SurveyCreator'

interface SurveyPreviewProps {
  survey: Survey
}

export default function SurveyPreview({ survey }: SurveyPreviewProps) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Survey Header */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-purple-500 p-8 mb-6">
        <div className="border-t-4 border-purple-500 -mt-8 -mx-8 pt-8 px-8">
          <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>
          {survey.description && (
            <p className="text-gray-600 dark:text-gray-400">{survey.description}</p>
          )}
          <p className="text-sm text-red-600 mt-4">* Zorunlu alan</p>
        </div>
      </div>

      {/* Questions Preview */}
      {survey.questions.map((question, index) => (
        <div key={question.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium">
              {index + 1}. {question.title}
              {question.required && <span className="text-red-600 ml-1">*</span>}
            </h3>
            {question.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{question.description}</p>
            )}
          </div>

          {/* Multiple Choice */}
          {question.type === 'multiple_choice' && (
            <div className="space-y-2">
              {question.options?.map((option, i) => (
                <label key={i} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  <input type="radio" name={`q-${question.id}`} className="w-4 h-4 text-purple-600" />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* Checkbox */}
          {question.type === 'checkbox' && (
            <div className="space-y-2">
              {question.options?.map((option, i) => (
                <label key={i} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  <input type="checkbox" className="w-4 h-4 text-purple-600 rounded" />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* Short Answer */}
          {question.type === 'short_answer' && (
            <input
              type="text"
              className="w-full px-4 py-2 border-b-2 border-gray-300 dark:border-gray-700 bg-transparent focus:border-purple-500 outline-none"
              placeholder="Kısa yanıtınız"
            />
          )}

          {/* Paragraph */}
          {question.type === 'paragraph' && (
            <textarea
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              placeholder="Uzun yanıtınız"
            />
          )}

          {/* Rating */}
          {question.type === 'rating' && (
            <div className="flex gap-2">
              {Array.from({ length: question.maxValue || 5 }, (_, i) => (
                <button
                  key={i}
                  className="text-3xl text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  ★
                </button>
              ))}
            </div>
          )}

          {/* Linear Scale */}
          {question.type === 'linear_scale' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{question.minLabel}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{question.maxLabel}</span>
              </div>
              <div className="flex gap-2 justify-between">
                {Array.from({ length: (question.maxValue || 10) - (question.minValue || 1) + 1 }, (_, i) => {
                  const value = (question.minValue || 1) + i
                  return (
                    <label key={i} className="flex flex-col items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name={`scale-${question.id}`}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-sm">{value}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          {/* Dropdown */}
          {question.type === 'dropdown' && (
            <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-gray-800">
              <option value="">Seçiniz...</option>
              {question.options?.map((option, i) => (
                <option key={i} value={option}>{option}</option>
              ))}
            </select>
          )}
        </div>
      ))}

      {/* Submit Button */}
      {survey.questions.length > 0 && (
        <div className="mt-6">
          <button className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            Gönder
          </button>
        </div>
      )}

      {survey.questions.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Henüz soru eklenmedi. Düzenleme moduna geçip sorularınızı ekleyin.
        </div>
      )}
    </div>
  )
}