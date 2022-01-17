import React, { useState } from "react";
import Modal from "react-modal";
import { useForm, SubmitHandler } from "react-hook-form";

import { Suggestion, SuggestionPostResponse, APIErrorResponse } from "types";

import AddIcon from "@icons/Add";
import CloseIcon from "@icons/Close";

import styles from "@styles/NewSuggestionModalForm.module.css";
import { BeatLoader } from "react-spinners";

interface PropTypes {
  setSuggestion?: (suggestion: Suggestion) => void;
  setSuccessMessage?: (message: string) => void;
  setShowModal: (boolean) => void;
  isOpen: boolean;
}

function NewSuggestionModalForm({
  isOpen,
  setSuggestion,
  setSuccessMessage,
  setShowModal,
}: PropTypes) {
  Modal.setAppElement("#__next");

  const closeModal = () => setShowModal(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Suggestion>();

  const onSubmit: SubmitHandler<Suggestion> = async (data) => {
    try {
      let response = await fetch("/v1/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data as Suggestion),
      });

      if (response.status === 201) {
        const respJSON = (await response.json()) as SuggestionPostResponse;

        setSuggestion && setSuggestion(respJSON.suggestion);

        setSuccessMessage &&
          setSuccessMessage(
            `Good news everyone! ${data.name} was added to the suggestions database!`
          );
        setShowModal(false);
        reset();
      } else {
        const respJSON = (await response.json()) as APIErrorResponse;
        setErrorMessage(respJSON.error_message);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Add a new suggestion"
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <button className={styles.closeBtn} onClick={closeModal}>
        <CloseIcon width={12} height={12} stroke="#000000" />
      </button>

      <div className={styles.modalHeader}>
        <h2>Add a new suggestion</h2>
      </div>
      <div className={styles.modalBody}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name of Restaurant</label>
            <input
              {...register("name", {
                required: "The name of the restaurant is required.",
              })}
              autoFocus
            />
            {errors.name && (
              <span className={styles.formInputError}>
                {errors.name.message}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Address of Restaurant</label>
            <input
              {...register("address", {
                required:
                  "Please enter the address for your restaurant suggestion.",
              })}
            />
            {errors.address && (
              <span className={styles.formInputError}>
                {errors.address.message}
              </span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="url">
              Link for more information (yelp, website, etc)
            </label>
            <input
              {...register("url", {
                required:
                  "A link to more information is required (yelp, business website, etc).",
                pattern: {
                  value:
                    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                  message: "Please enter a valid website url.",
                },
              })}
            />
            {errors.url && (
              <span className={styles.formInputError}>
                {errors.url.message}
              </span>
            )}
          </div>
          <div className={styles.formFooter}>
            <button className="secondary" disabled={isSubmitting}>
              {isSubmitting ? (
                <BeatLoader color="#ffffff" size={10} />
              ) : (
                <AddIcon width={18} height={18} />
              )}
              &nbsp; Add Suggestion
            </button>

            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default NewSuggestionModalForm;
