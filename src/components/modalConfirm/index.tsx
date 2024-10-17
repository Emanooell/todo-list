import styles from "./styles.module.css"; 
interface Imodal {
  onDelete: () => void;
  onCancel: () => void;
}
export default function ModalConfirm(props: Imodal) {
  return (
    <div className={styles.modalOverlay} onClick={props.onCancel}>
      <div className={styles.modalContainer}>
        <h4 className={styles.modalTitle}>Confirmação</h4>
        <p className={styles.modalText}>
          Tem certeza que deseja deletar esta tarefa?
        </p>
        <div className={styles.modalButtons}>
          <button className={styles.deleteButton} onClick={props.onDelete}>
            Deletar
          </button>
          <button className={styles.cancelButton} onClick={props.onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
