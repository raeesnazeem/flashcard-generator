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
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi'
import { addFlashcard } from '../redux/flashcardSlice'

// Validation schema for creating a flashcard deck
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

// Initial empty form state
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

  // Array of input refs to programmatically focus term title fields on edit click
  const termTitleRefs = useRef([])

  // Helper to convert uploaded image file to Base64 string for local persistence
  const handleImageFile = (file, callback) => {
    setImageError(null)

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageError('Please upload a valid image file (PNG, JPG, WebP).')
      return
    }

    // Limit image size to 1.5MB to maintain smooth localStorage performance
    if (file.size > 1.5 * 1024 * 1024) {
      setImageError('Image size exceeds 1.5MB. Please choose a smaller image.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      callback(reader.result)
    }
    reader.onerror = () => {
      setImageError('Failed to read image file.')
    }
    reader.readAsDataURL(file)
  }

  // Handle form submission
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

    // Save to Redux (auto-synced to LocalStorage via store subscriber)
    dispatch(addFlashcard(newDeck))
    setSubmitting(false)
    resetForm()
    setSuccessToast(true)

    // Redirect to library after short feedback delay
    setTimeout(() => {
      navigate('/my-flashcards')
    }, 1200)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-white border border-apple-success/40 text-apple-ink px-4 py-3 rounded-apple-md shadow-apple-raised animate-bounce">
          <FiCheckCircle className="w-5 h-5 text-apple-success flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">Deck Created Successfully!</p>
            <p className="text-xs text-apple-muted">Redirecting to your library...</p>
          </div>
        </div>
      )}

      {/* Global Image Warning if any */}
      {imageError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-apple-md text-sm">
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
          <Form className="space-y-8">
            {/* 1. Main Group Information Card */}
            <div className="apple-card p-6 sm:p-8 bg-white space-y-6">
              <div className="border-b border-apple-border/40 pb-4">
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-apple-ink">
                  Create New Group
                </h2>
                <p className="text-xs sm:text-sm text-apple-muted mt-1">
                  Define the deck category, title, description, and optional cover image.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Group Title Field */}
                <div className="md:col-span-2 space-y-1.5">
                  <label
                    htmlFor="groupName"
                    className="block text-xs font-semibold uppercase tracking-wider text-apple-ink"
                  >
                    Group Name <span className="text-apple-danger">*</span>
                  </label>
                  <Field
                    id="groupName"
                    name="groupName"
                    type="text"
                    placeholder="e.g. Web Development Fundamentals"
                    className={`apple-input ${
                      touched.groupName && errors.groupName
                        ? 'border-apple-danger focus:border-apple-danger'
                        : ''
                    }`}
                  />
                  <ErrorMessage
                    name="groupName"
                    component="div"
                    className="text-xs text-apple-danger mt-1 flex items-center gap-1"
                  />
                </div>

                {/* Group Cover Image Upload */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-apple-ink">
                    Group Image <span className="text-apple-muted lowercase font-normal">(optional)</span>
                  </label>

                  {values.groupImage ? (
                    <div className="relative group inline-block w-full">
                      <img
                        src={values.groupImage}
                        alt="Group cover"
                        className="w-full h-24 object-cover rounded-apple-sm border border-apple-border"
                      />
                      <button
                        type="button"
                        onClick={() => setFieldValue('groupImage', null)}
                        className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-black text-white p-1 rounded-full shadow transition-transform hover:scale-110"
                        title="Remove Image"
                      >
                        <FiX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-24 px-4 border-2 border-dashed border-apple-border hover:border-apple-blue/60 rounded-apple-sm cursor-pointer bg-apple-surface/50 hover:bg-apple-blue/5 transition-colors">
                      <FiUpload className="w-5 h-5 text-apple-muted mb-1" />
                      <span className="text-xs font-medium text-apple-blue">Upload Image</span>
                      <span className="text-[10px] text-apple-muted">Max 1.5MB</span>
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
                <div className="md:col-span-3 space-y-1.5">
                  <label
                    htmlFor="groupDescription"
                    className="block text-xs font-semibold uppercase tracking-wider text-apple-ink"
                  >
                    Group Description <span className="text-apple-danger">*</span>
                  </label>
                  <Field
                    as="textarea"
                    id="groupDescription"
                    name="groupDescription"
                    rows="3"
                    placeholder="Describe the topics covered in this flashcard deck..."
                    className={`apple-input resize-none ${
                      touched.groupDescription && errors.groupDescription
                        ? 'border-apple-danger focus:border-apple-danger'
                        : ''
                    }`}
                  />
                  <ErrorMessage
                    name="groupDescription"
                    component="div"
                    className="text-xs text-apple-danger mt-1 flex items-center gap-1"
                  />
                </div>
              </div>
            </div>

            {/* 2. Dynamic Terms & Definitions Section */}
            <div className="apple-card p-6 sm:p-8 bg-white space-y-6">
              <div className="flex items-center justify-between border-b border-apple-border/40 pb-4">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-apple-ink">
                    Add Terms
                  </h2>
                  <p className="text-xs sm:text-sm text-apple-muted mt-1">
                    Enter key terms, their definitions, and optional illustrative images.
                  </p>
                </div>
                <span className="apple-badge apple-badge-accent">
                  {values.terms.length} {values.terms.length === 1 ? 'Term' : 'Terms'}
                </span>
              </div>

              <FieldArray name="terms">
                {({ push, remove }) => (
                  <div className="space-y-6">
                    {values.terms.map((termItem, index) => (
                      <div
                        key={termItem.id || index}
                        className="p-4 sm:p-5 rounded-apple-md bg-apple-surface/60 border border-apple-border/70 space-y-4 transition-all"
                      >
                        {/* Term Header / Row Number and Actions */}
                        <div className="flex items-center justify-between">
                          <span className="w-6 h-6 rounded-full bg-apple-ink text-white text-xs font-semibold flex items-center justify-center">
                            {index + 1}
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Edit Icon to Focus Title Input */}
                            <button
                              type="button"
                              onClick={() => {
                                termTitleRefs.current[index]?.focus()
                              }}
                              className="p-1.5 text-apple-muted hover:text-apple-blue rounded-full hover:bg-apple-border/50 transition-colors"
                              title="Focus & Edit Term"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>

                            {/* Trash Icon to Remove Row */}
                            {values.terms.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-1.5 text-apple-muted hover:text-apple-danger rounded-full hover:bg-apple-border/50 transition-colors"
                                title="Delete Term"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Term Inputs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          {/* Term Name Field */}
                          <div className="md:col-span-4 space-y-1">
                            <label
                              htmlFor={`terms.${index}.term`}
                              className="block text-xs font-medium text-apple-ink"
                            >
                              Enter Term <span className="text-apple-danger">*</span>
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
                              placeholder="e.g. Closure"
                              className={`apple-input text-sm ${
                                touched.terms?.[index]?.term && errors.terms?.[index]?.term
                                  ? 'border-apple-danger focus:border-apple-danger'
                                  : ''
                              }`}
                            />
                            {touched.terms?.[index]?.term && errors.terms?.[index]?.term && (
                              <div className="text-xs text-apple-danger mt-0.5">
                                {errors.terms[index].term}
                              </div>
                            )}
                          </div>

                          {/* Term Definition Field */}
                          <div className="md:col-span-5 space-y-1">
                            <label
                              htmlFor={`terms.${index}.definition`}
                              className="block text-xs font-medium text-apple-ink"
                            >
                              Enter Definition <span className="text-apple-danger">*</span>
                            </label>
                            <textarea
                              id={`terms.${index}.definition`}
                              name={`terms[${index}].definition`}
                              value={termItem.definition}
                              rows="2"
                              onChange={(e) =>
                                setFieldValue(`terms[${index}].definition`, e.target.value)
                              }
                              placeholder="Write a concise definition..."
                              className={`apple-input resize-none text-sm ${
                                touched.terms?.[index]?.definition &&
                                errors.terms?.[index]?.definition
                                  ? 'border-apple-danger focus:border-apple-danger'
                                  : ''
                              }`}
                            />
                            {touched.terms?.[index]?.definition &&
                              errors.terms?.[index]?.definition && (
                                <div className="text-xs text-apple-danger mt-0.5">
                                  {errors.terms[index].definition}
                                </div>
                              )}
                          </div>

                          {/* Term Image Upload / Preview */}
                          <div className="md:col-span-3 space-y-1">
                            <label className="block text-xs font-medium text-apple-ink">
                              Image <span className="text-apple-muted font-normal">(optional)</span>
                            </label>

                            {termItem.image ? (
                              <div className="relative group inline-block w-full">
                                <img
                                  src={termItem.image}
                                  alt={`Term ${index + 1}`}
                                  className="w-full h-14 object-cover rounded-apple-sm border border-apple-border"
                                />
                                <button
                                  type="button"
                                  onClick={() => setFieldValue(`terms[${index}].image`, null)}
                                  className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white p-0.5 rounded-full shadow"
                                  title="Remove image"
                                >
                                  <FiX className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <label className="flex items-center justify-center gap-2 h-10 px-3 border border-apple-border hover:border-apple-blue rounded-apple-sm cursor-pointer bg-white hover:bg-apple-blue/5 transition-colors text-xs text-apple-ink">
                                <FiImage className="w-4 h-4 text-apple-blue" />
                                <span className="font-medium">Select Image</span>
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

                    {/* Add More Term Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => push(createInitialTerm())}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-apple-sm border border-dashed border-apple-blue text-apple-blue hover:bg-apple-blue/5 text-sm font-semibold transition-colors"
                      >
                        <FiPlus className="w-4 h-4" />
                        <span>+ Add More</span>
                      </button>
                    </div>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* 3. Form Submit Button Bar */}
            <div className="flex items-center justify-center pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-apple-primary px-8 py-3 text-base shadow-sm font-semibold min-w-[200px]"
              >
                {isSubmitting ? 'Creating Deck...' : 'Create Flashcard'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
