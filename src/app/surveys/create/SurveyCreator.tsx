'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import QuestionEditor from './QuestionEditor'
import AIAssistant from './AIAssistant'
import SurveyPreview from './SurveyPreview'

export type QuestionType = 'multiple_choice' | 'checkbox' | 'short_answer' | 'paragraph' | 'rating' | 'linear_scale' | 'dropdown'

export interface Question {
  id: string
  type: QuestionType
  title: string
  description?: string
  required: boolean
  options?: string[]
  minValue?: number
  maxValue?: number
  minLabel?: string
  maxLabel?: string
}

export interface Survey {
  title: string
  description: string
  questions: Question[]
}

interface SurveyCreatorProps {
  userId: string
}

export default function SurveyCreator({ userId }: SurveyCreatorProps) {
  const [survey, setSurvey] = useState<Survey>({
    title: 'İsimsiz Anket',
    description: '',
    questions: []
  })
  
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)

  const addQuestion = (type: QuestionType = 'multiple_choice') => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type,
      title: 'Başlıksız Soru',
      required: false,
      ...(type === 'multiple_choice' || type === 'checkbox' || type === 'dropdown' 
        ? { options: ['Seçenek 1'] }
        : {}),
      ...(type === 'rating' 
        ? { minValue: 1, maxValue: 5 }
        : {}),
      ...(type === 'linear_scale' 
        ? { minValue: 1, maxValue: 10, minLabel: 'En düşük', maxLabel: 'En yüksek' }
        : {})
    }
    setSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
    setSelectedQuestionId(newQuestion.id)
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, ...updates } : q
      )
    }))
  }

  const deleteQuestion = (id: string) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }))
    if (selectedQuestionId === id) {
      setSelectedQuestionId(null)
    }
  }

  const duplicateQuestion = (id: string) => {
    const question = survey.questions.find(q => q.id === id)
    if (question) {
      const newQuestion = {
        ...question,
        id: `q-${Date.now()}`,
      }
      const index = survey.questions.findIndex(q => q.id === id)
      setSurvey(prev => ({
        ...prev,
        questions: [
          ...prev.questions.slice(0, index + 1),
          newQuestion,
          ...prev.questions.slice(index + 1)
        ]
      }))
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(survey.questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSurvey(prev => ({ ...prev, questions: items }))
  }

  const handleAIGenerate = (questions: Question[]) => {
    setSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, ...questions]
    }))
    setShowAIAssistant(false)
  }

  const saveSurvey = async () => {
    // TODO: Supabase'e kaydet
    console.log('Survey saved:', survey)
    alert('Anket kaydedildi! 🎉')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <input
                type="text"
                value={survey.title}
                onChange={(e) => setSurvey(prev => ({ ...prev, title: e.target.value }))}
                className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                placeholder="Anket Başlığı"
              />
              <input
                type="text"
                value={survey.description}
                onChange={(e) => setSurvey(prev => ({ ...prev, description: e.target.value }))}
                className="text-sm text-gray-600 dark:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 w-full mt-1"
                placeholder="Anket açıklaması (isteğe bağlı)"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Asistan
              </button>
              
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeTab === 'edit' 
                      ? 'bg-white dark:bg-gray-900 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Düzenle
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeTab === 'preview' 
                      ? 'bg-white dark:bg-gray-900 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Önizle
                </button>
              </div>
              
              <button
                onClick={saveSurvey}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      {showAIAssistant && (
        <AIAssistant 
          onGenerate={handleAIGenerate}
          onClose={() => setShowAIAssistant(false)}
        />
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'edit' ? (
          <>
            {/* Survey Header Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-purple-500 p-8 mb-6">
              <div className="border-t-4 border-purple-500 -mt-8 -mx-8 pt-8 px-8">
                <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>
                {survey.description && (
                  <p className="text-gray-600 dark:text-gray-400">{survey.description}</p>
                )}
              </div>
            </div>

            {/* Questions */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {survey.questions.map((question, index) => (
                      <Draggable key={question.id} draggableId={question.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`transition-shadow ${
                              snapshot.isDragging ? 'shadow-2xl' : ''
                            }`}
                          >
                            <QuestionEditor
                              question={question}
                              isSelected={selectedQuestionId === question.id}
                              onSelect={() => setSelectedQuestionId(question.id)}
                              onUpdate={(updates) => updateQuestion(question.id, updates)}
                              onDelete={() => deleteQuestion(question.id)}
                              onDuplicate={() => duplicateQuestion(question.id)}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* Add Question Button */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => addQuestion('multiple_choice')}
                className="flex-1 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
              >
                + Soru Ekle
              </button>
            </div>

            {/* Question Type Selector */}
            {survey.questions.length > 0 && (
              <div className="mt-4 bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Hızlı Ekle:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { type: 'multiple_choice' as QuestionType, icon: '○', label: 'Çoktan Seçmeli' },
                    { type: 'checkbox' as QuestionType, icon: '☑', label: 'Onay Kutusu' },
                    { type: 'short_answer' as QuestionType, icon: '─', label: 'Kısa Yanıt' },
                    { type: 'paragraph' as QuestionType, icon: '☰', label: 'Paragraf' },
                    { type: 'dropdown' as QuestionType, icon: '▼', label: 'Açılır Liste' },
                    { type: 'rating' as QuestionType, icon: '★', label: 'Yıldız' },
                    { type: 'linear_scale' as QuestionType, icon: '─●─', label: 'Doğrusal Ölçek' },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => addQuestion(item.type)}
                      className="p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-xl mr-2">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <SurveyPreview survey={survey} />
        )}
      </div>
    </div>
  )
}