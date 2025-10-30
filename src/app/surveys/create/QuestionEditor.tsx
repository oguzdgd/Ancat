'use client'

import { Question, QuestionType } from './SurveyCreator'

interface QuestionEditorProps {
  question: Question
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<Question>) => void
  onDelete: () => void
  onDuplicate: () => void
  dragHandleProps: any
}

const questionTypeIcons: Record<QuestionType, string> = {
  multiple_choice: '○',
  checkbox: '☑',
  short_answer: '─',
  paragraph: '☰',
  rating: '★',
  linear_scale: '─●─',
  dropdown: '▼'
}

const questionTypeLabels: Record<QuestionType, string> = {
  multiple_choice: 'Çoktan Seçmeli',
  checkbox: 'Onay Kutusu',
  short_answer: 'Kısa Yanıt',
  paragraph: 'Paragraf',
  rating: 'Yıldız Puanı',
  linear_scale: 'Doğrusal Ölçek',
  dropdown: 'Açılır Liste'
}

export default function QuestionEditor({
  question,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  dragHandleProps
}: QuestionEditorProps) {
  
  const addOption = () => {
    const newOptions = [...(question.options || []), `Seçenek ${(question.options?.length || 0) + 1}`]
    onUpdate({ options: newOptions })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(question.options || [])]
    newOptions[index] = value
    onUpdate({ options: newOptions })
  }

  const deleteOption = (index: number) => {
    const newOptions = question.options?.filter((_, i) => i !== index)
    onUpdate({ options: newOptions })
  }

  return (
    <div
      onClick={onSelect}
      className={`bg-white dark:bg-gray-900 rounded-xl border-2 p-6 transition-all cursor-pointer ${
        isSelected 
          ? 'border-purple-500 shadow-lg' 
          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
      }`}
    >
      <div className="flex gap-4">
        {/* Drag Handle */}
        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing pt-2">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>

        <div className="flex-1">
          {/* Question Header */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={question.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="flex-1 text-lg font-medium bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 outline-none transition-colors pb-2"
              placeholder="Soru"
              onClick={(e) => e.stopPropagation()}
            />
            
            <select
              value={question.type}
              onChange={(e) => onUpdate({ type: e.target.value as QuestionType })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              {Object.entries(questionTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {questionTypeIcons[value as QuestionType]} {label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <input
            type="text"
            value={question.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="w-full text-sm text-gray-600 dark:text-gray-400 bg-transparent border-none outline-none mb-4"
            placeholder="Açıklama (isteğe bağlı)"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Question Type Specific Content */}
          <div className="space-y-3">
            {(question.type === 'multiple_choice' || question.type === 'checkbox' || question.type === 'dropdown') && (
              <>
                {question.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      {question.type === 'multiple_choice' && (
                        <span className="text-gray-400">○</span>
                      )}
                      {question.type === 'checkbox' && (
                        <span className="text-gray-400">☑</span>
                      )}
                      {question.type === 'dropdown' && (
                        <span className="text-gray-400">{index + 1}.</span>
                      )}
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-transparent focus:border-purple-500 outline-none"
                        placeholder={`Seçenek ${index + 1}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {question.options!.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteOption(index)
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    addOption()
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <span>+</span> Seçenek Ekle
                </button>
              </>
            )}

            {question.type === 'short_answer' && (
              <input
                type="text"
                disabled
                className="w-full px-3 py-2 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400"
                placeholder="Kısa yanıt metni"
              />
            )}

            {question.type === 'paragraph' && (
              <textarea
                disabled
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-400 resize-none"
                placeholder="Uzun yanıt metni"
              />
            )}

            {question.type === 'rating' && (
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-2xl text-yellow-400">★</span>
                  ))}
                </div>
                <div className="flex gap-2 text-sm">
                  <input
                    type="number"
                    value={question.minValue || 1}
                    onChange={(e) => onUpdate({ minValue: parseInt(e.target.value) })}
                    className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded"
                    onClick={(e) => e.stopPropagation()}
                    min="1"
                  />
                  <span className="self-center">-</span>
                  <input
                    type="number"
                    value={question.maxValue || 5}
                    onChange={(e) => onUpdate({ maxValue: parseInt(e.target.value) })}
                    className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded"
                    onClick={(e) => e.stopPropagation()}
                    max="10"
                  />
                </div>
              </div>
            )}

            {question.type === 'linear_scale' && (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={question.minValue || 1}
                    onChange={(e) => onUpdate({ minValue: parseInt(e.target.value) })}
                    className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded" />
                  <input
                    type="number"
                    value={question.maxValue || 10}
                    onChange={(e) => onUpdate({ maxValue: parseInt(e.target.value) })}
                    className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={question.minLabel || ''}
                    onChange={(e) => onUpdate({ minLabel: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm"
                    placeholder="Min etiket"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    type="text"
                    value={question.maxLabel || ''}
                    onChange={(e) => onUpdate({ maxLabel: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm"
                    placeholder="Max etiket"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDuplicate()
          }}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          title="Kopyala"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          title="Sil"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm text-gray-600 dark:text-gray-400">Zorunlu</span>
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => {
              e.stopPropagation()
              onUpdate({ required: e.target.checked })
            }}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
        </label>
      </div>
    </div>
  )
}