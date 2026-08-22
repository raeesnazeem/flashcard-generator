import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  FiUpload,
  FiTrash2,
  FiEdit2,
  FiPlus,
  FiImage,
  FiX,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi'
import { addFlashcard } from '../redux/flashcardSlice'

const FlashcardValidationSchema = Yup.object().shape({
  groupName: Yup.string()
    .trim()
    .min(3, 'Group title must be at least 3 characters')
    .max(80, 'Group title cannot exceed 80 characters')
    .required('Group name is required'),
  groupDescription: Yup.string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters')
    .required('Group description is required'),
  groupImage: Yup.string().nullable(),
  terms: Yup.array()
    .of(
      Yup.object().shape({
        term: Yup.string()
          .trim()
          .min(1, 'Term title is required')
          .max(80, 'Term title cannot exceed 80 characters')
          .required('Term title is required'),
        definition: Yup.string()
          .trim()
          .min(3, 'Definition must be at least 3 characters')
          .max(600, 'Definition cannot exceed 600 characters')
          .required('Definition is required'),
        image: Yup.string().nullable()
      })
    )
    .min(1, 'At least one flashcard term is required')
})

const createInitialTerm = () => ({
  id: `term-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  term: '',
  definition: '',
  image: null
})

const initialFormValues = {
  groupName: '',
  groupDescription: '',
  groupImage: null,
  terms: [createInitialTerm()]
}

export default function CreateFlashcard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [successToast, setSuccessToast] = useState(false)
  const [imageError, setImageError] = useState(null)

  const termTitleRefs = useRef([])

  const handleImageFile = (file, callback) => {
    setImageError(null)
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageError('Please upload a valid image file (PNG, JPG, WebP).')
      return
    }

    if (file.size > 1.5 * 1024 * 1024) {
      setImageError('Image size exceeds 1.5MB. Please select a smaller file.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => callback(reader.result)
    reader.onerror = () => setImageError('Failed to process image file.')
    reader.readAsDataURL(file)
  }

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const newDeck = {
      id: `deck-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      groupName: values.groupName.trim(),
      groupDescription: values.groupDescription.trim(),
      groupImage: values.groupImage || null,
      createdAt: new Date().toISOString(),
      terms: values.terms.map((t, index) => ({
        id: t.id || `term-${Date.now()}-${index}`,
        term: t.term.trim(),
        definition: t.definition.trim(),
        image: t.image || null
      }))
    }

    dispatch(addFlashcard(newDeck))
    setSubmitting(false)
    resetForm()
    setSuccessToast(true)

    setTimeout(() => {
      navigate('/my-flashcards')
    }, 1100)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-hairline pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge-mono">01 // CREATION</span>
          <span className="font-mono text-xs text-ink-muted uppercase tracking-wider">
            Deck Constructor
          </span>
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-medium tracking-tight text-ink">
          Create Flashcard Deck
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          Set up a structured vocabulary, concept, or formula deck with definitions and visual assets.
        </p>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-canvas border border-ink text-ink px-4 py-3 rounded-sm shadow-soft-drop animate-fade-in">
          <div className="w-5 h-5 rounded-xs bg-brand-mint flex items-center justify-center text-ink flex-shrink-0">
            <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider">
              Deck Saved Successfully
            </p>
            <p className="text-xs text-ink-muted">Routing to library...</p>
          </div>
        </div>
      )}

      {/* Global Image Error Warning */}
      {imageError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-sm text-xs font-mono">
          <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{imageError}</span>
          <button
            type="button"
            onClick={() => setImageError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      <Formik
        initialValues={initialFormValues}
        validationSchema={FlashcardValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="space-y-8" autoComplete="off">
            {/* Section 1: Main Group Information Card */}
            <div className="card-surface p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-hairline pb-4">
                <div>
                  <h2 className="font-mono text-xs uppercase tracking-widest text-ink font-semibold">
                    Group Details
                  </h2>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Define primary metadata and optional deck cover.
                  </p>
                </div>
                <span className="badge-mono">STEP 1</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Group Title Field */}
                <div className="md:col-span-2 space-y-2">
                  <label
                    htmlFor="groupName"
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink font-medium"
                  >
                    Group Name <span className="text-brand-orange">*</span>
                  </label>
                  <Field
                    id="groupName"
                    name="groupName"
                    type="text"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    placeholder="e.g. Distributed Systems Architecture"
                    className={`input-field font-sans ${
                      touched.groupName && errors.groupName
                        ? 'border-red-500 focus:border-red-500'
                        : ''
                    }`}
                  />
                  <ErrorMessage
                    name="groupName"
                    component="div"
                    className="font-mono text-[11px] text-red-600 mt-1"
                  />
                </div>

                {/* Group Cover Image Upload */}
                <div className="space-y-2">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-ink font-medium">
                    Deck Cover <span className="text-ink-light lowercase font-normal">(optional)</span>
                  </label>

                  {values.groupImage ? (
                    <div className="relative group inline-block w-full">
                      <img
                        src={values.groupImage}
                        alt="Group cover"
                        className="w-full h-24 object-cover rounded-sm border border-hairline"
                      />
                      <button
                        type="button"
                        onClick={() => setFieldValue('groupImage', null)}
                        className="absolute top-1.5 right-1.5 bg-ink text-white p-1 rounded-xs hover:bg-red-600 transition-colors"
                        title="Remove Image"
                      >
                        <FiX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-24 px-4 border border-dashed border-hairline hover:border-ink rounded-sm cursor-pointer bg-canvas-soft hover:bg-canvas transition-colors">
                      <FiUpload className="w-4 h-4 text-ink-muted mb-1" />
                      <span className="font-mono text-[11px] uppercase tracking-wider text-ink">
                        Upload Image
                      </span>
                      <span className="font-mono text-[10px] text-ink-light mt-0.5">MAX 1.5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          handleImageFile(file, (base64) => setFieldValue('groupImage', base64))
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* Group Description Field */}
                <div className="md:col-span-3 space-y-2">
                  <label
                    htmlFor="groupDescription"
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink font-medium"
                  >
                    Group Description <span className="text-brand-orange">*</span>
                  </label>
                  <Field
                    as="textarea"
                    id="groupDescription"
                    name="groupDescription"
                    rows="3"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    placeholder="Describe the topics and key knowledge areas covered in this deck..."
                    className={`input-field font-sans resize-none ${
                      touched.groupDescription && errors.groupDescription
                        ? 'border-red-500 focus:border-red-500'
                        : ''
                    }`}
                  />
                  <ErrorMessage
                    name="groupDescription"
                    component="div"
                    className="font-mono text-[11px] text-red-600 mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Cards / Terms Section */}
            <div className="card-surface p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-hairline pb-4">
                <div>
                  <h2 className="font-mono text-xs uppercase tracking-widest text-ink font-semibold">
                    Cards & Definitions
                  </h2>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Add terms, concise definitions, and optional diagrams.
                  </p>
                </div>
                <span className="badge-mono badge-mint">
                  {values.terms.length} {values.terms.length === 1 ? 'CARD' : 'CARDS'}
                </span>
              </div>

              <FieldArray name="terms">
                {({ push, remove }) => (
                  <div className="space-y-4">
                    {values.terms.map((termItem, index) => (
                      <div
                        key={termItem.id || index}
                        className="p-4 sm:p-5 rounded-sm bg-canvas-soft border border-hairline space-y-4 transition-all"
                      >
                        {/* Term Header Row */}
                        <div className="flex items-center justify-between border-b border-hairline/60 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-xs bg-ink text-white">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="font-mono text-xs text-ink-muted uppercase tracking-wider">
                              Flashcard Entry
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Focus Edit Button */}
                            <button
                              type="button"
                              onClick={() => termTitleRefs.current[index]?.focus()}
                              className="p-1.5 text-ink-muted hover:text-ink rounded-xs hover:bg-hairline transition-colors"
                              title="Focus Input"
                            >
                              <FiEdit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Trash Button */}
                            {values.terms.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-1.5 text-ink-muted hover:text-red-600 rounded-xs hover:bg-red-50 transition-colors"
                                title="Delete Card"
                              >
                                <FiTrash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Card Inputs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          {/* Term Field */}
                          <div className="md:col-span-4 space-y-1.5">
                            <label
                              htmlFor={`terms.${index}.term`}
                              className="block font-mono text-[11px] uppercase tracking-wider text-ink font-medium"
                            >
                              Term <span className="text-brand-orange">*</span>
                            </label>
                            <input
                              type="text"
                              id={`terms.${index}.term`}
                              name={`terms[${index}].term`}
                              value={termItem.term}
                              ref={(el) => (termTitleRefs.current[index] = el)}
                              onChange={(e) =>
                                setFieldValue(`terms[${index}].term`, e.target.value)
                              }
                              autoComplete="off"
                              autoCorrect="off"
                              autoCapitalize="off"
                              spellCheck="false"
                              placeholder="e.g. CAP Theorem"
                              className={`input-field font-sans ${
                                touched.terms?.[index]?.term && errors.terms?.[index]?.term
                                  ? 'border-red-500 focus:border-red-500'
                                  : ''
                              }`}
                            />
                            {touched.terms?.[index]?.term && errors.terms?.[index]?.term && (
                              <div className="font-mono text-[11px] text-red-600 mt-1">
                                {errors.terms[index].term}
                              </div>
                            )}
                          </div>

                          {/* Definition Field */}
                          <div className="md:col-span-5 space-y-1.5">
                            <label
                              htmlFor={`terms.${index}.definition`}
                              className="block font-mono text-[11px] uppercase tracking-wider text-ink font-medium"
                            >
                              Definition <span className="text-brand-orange">*</span>
                            </label>
                            <textarea
                              id={`terms.${index}.definition`}
                              name={`terms[${index}].definition`}
                              value={termItem.definition}
                              rows="2"
                              onChange={(e) =>
                                setFieldValue(`terms[${index}].definition`, e.target.value)
                              }
                              autoComplete="off"
                              autoCorrect="off"
                              autoCapitalize="off"
                              spellCheck="false"
                              placeholder="Write definition..."
                              className={`input-field font-sans resize-none ${
                                touched.terms?.[index]?.definition &&
                                errors.terms?.[index]?.definition
                                  ? 'border-red-500 focus:border-red-500'
                                  : ''
                              }`}
                            />
                            {touched.terms?.[index]?.definition &&
                              errors.terms?.[index]?.definition && (
                                <div className="font-mono text-[11px] text-red-600 mt-1">
                                  {errors.terms[index].definition}
                                </div>
                              )}
                          </div>

                          {/* Optional Card Image Upload */}
                          <div className="md:col-span-3 space-y-1.5">
                            <label className="block font-mono text-[11px] uppercase tracking-wider text-ink font-medium">
                              Image <span className="text-ink-light lowercase font-normal">(optional)</span>
                            </label>

                            {termItem.image ? (
                              <div className="relative group inline-block w-full">
                                <img
                                  src={termItem.image}
                                  alt={`Card ${index + 1}`}
                                  className="w-full h-14 object-cover rounded-sm border border-hairline"
                                />
                                <button
                                  type="button"
                                  onClick={() => setFieldValue(`terms[${index}].image`, null)}
                                  className="absolute top-1 right-1 bg-ink text-white p-0.5 rounded-xs hover:bg-red-600 transition-colors"
                                  title="Remove image"
                                >
                                  <FiX className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <label className="flex items-center justify-center gap-2 h-10 px-3 border border-hairline hover:border-ink rounded-sm cursor-pointer bg-canvas hover:bg-canvas-soft transition-colors font-mono text-[11px] uppercase tracking-wider text-ink">
                                <FiImage className="w-3.5 h-3.5 text-ink-muted" />
                                <span>Attach Image</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files[0]
                                    handleImageFile(file, (base64) =>
                                      setFieldValue(`terms[${index}].image`, base64)
                                    )
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add More Cards Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => push(createInitialTerm())}
                        className="btn-secondary-white border-dashed text-ink font-mono text-xs uppercase tracking-wider"
                      >
                        <FiPlus className="w-3.5 h-3.5" />
                        <span>Add Card Row</span>
                      </button>
                    </div>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Form Action Controls */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-hairline">
              <button
                type="button"
                onClick={() => resetForm()}
                className="btn-secondary-white text-xs"
              >
                Reset Form
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary min-w-[180px] text-xs py-2.5 shadow-sm"
              >
                {isSubmitting ? 'SAVING DECK...' : 'CREATE FLASHCARD DECK'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

