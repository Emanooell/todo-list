import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import styles from "./styles.module.css";

export default function AddTask() {
  const router = useRouter();
  const [task, setTask] = useState("");
  const [formError, setFormError] = useState("");
  const handleAddTask = () => {
    if (task.trim()) {
      const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      tasks.push(task);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      router.push("/"); 
    }
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!task.trim()) {
      setFormError("Este campo é obrigatório");
      return;
    }
    handleAddTask();
  };
  return (
    <form onSubmit={onSubmit}>
      <div className={styles.container}>
        <h4 className={styles.title}>Adicionar Nova Tarefa</h4>
        <div style={{ position: "relative" }}>
          <input
            className={`${formError ? styles.inputError : styles.input}`}
            type="text"
            value={task}
            onChange={(e) => {
              setTask(e.target.value);
              if (formError) setFormError("");
            }}
            placeholder="Digite sua tarefa"
          />
          <div className={styles.containerError}>
            <p className={styles.error}>{formError}</p>
          </div>
        </div>
        <div className={styles.containerButtons}>
          <button className={styles.addButton} >
            Adicionar Tarefa
          </button>
          <button
            className={styles.backButton}
            onClick={() => router.push("/")}
          >
            Voltar
          </button>
        </div>
      </div>
    </form>
  );
}
