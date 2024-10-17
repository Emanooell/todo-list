import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import trashIcon from "../../public/trash.svg";

import Image from "next/image";
import ModalConfirm from "@/components/modalConfirm";

export default function Tasks() {
  const router = useRouter();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);
  const [checkedTasks, setCheckedTasks] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [isCompletedTask, setIsCompletedTask] = useState(false);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(storedTasks);
  }, []);

  const handleDeleteTask = (index: number) => {
    setTaskToDelete(index);
    setIsCompletedTask(false);
    setIsModalOpen(true);
  };

  const handleDeleteCompletedTask = (index: number) => {
    setTaskToDelete(index);
    setIsCompletedTask(true);
    setIsModalOpen(true);
  };

  const completeTask = (index: number) => {
    const taskToComplete = tasks[index];
    setCompletedTasks([...completedTasks, taskToComplete]);
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setCheckedTasks(checkedTasks.filter((i) => i !== index));
  };

  const confirmDeleteTask = () => {
    if (taskToDelete !== null) {
      if (isCompletedTask) {
        removeCompletedTask(taskToDelete);
      } else {
        removeTask(taskToDelete);
      }
      setIsModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setTaskToDelete(null);
  };

  const handleCheckboxChange = (index: number) => {
    if (checkedTasks.includes(index)) {
      setCheckedTasks(checkedTasks.filter((i) => i !== index));
    } else {
      setCheckedTasks([...checkedTasks, index]);
      setTimeout(() => completeTask(index), 100);
    }
  };

  const removeTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setCheckedTasks(checkedTasks.filter((i) => i !== index));
  };

  const removeCompletedTask = (index: number) => {
    setCompletedTasks(completedTasks.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Minhas atividades</h4>
      <ul className={styles.taskList}>
        {tasks.map((task, index) => (
          <li key={index} className={styles.taskItem}>
            <input
              className={styles.input}
              type="checkbox"
              checked={checkedTasks.includes(index)}
              onChange={() => handleCheckboxChange(index)}
            />
            {task}
            <div className={styles.containerTrash}>
              <Image
                className={styles.img}
                src={trashIcon}
                alt="Icone de lixeira"
                onClick={() => handleDeleteTask(index)}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.containerTasksEnd}>
        <h4 className={styles.title}>Atividades Finalizadas</h4>
        <ul className={styles.taskList}>
          {completedTasks.map((task, index) => (
            <li key={index} className={styles.taskItem}>
              <span>{task}</span>
              <div className={styles.containerTrash}>
                <Image
                  className={styles.img}
                  src={trashIcon}
                  alt="Icone de lixeira"
                  onClick={() => handleDeleteCompletedTask(index)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button
        className={styles.addButton}
        onClick={() => router.push("/addTask")}
      >
        Adicionar Nova Tarefa
      </button>

      {isModalOpen && (
        <ModalConfirm
          onDelete={confirmDeleteTask}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
