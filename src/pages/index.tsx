import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import trashIcon from "./trash.svg";
import Image from "next/image";
import ModalConfirm from "@/components/modalConfirm"; // Certifique-se que o caminho está correto

export default function Tasks() {
  const router = useRouter();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);
  const [checkedTasks, setCheckedTasks] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para modal
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null); // Estado para armazenar o índice da tarefa a ser deletada
  const [isCompletedTask, setIsCompletedTask] = useState(false); // Estado para saber se a tarefa é completada

  // Carregar as tarefas do localStorage quando a página é montada
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(storedTasks);
  }, []);

  // Abre o modal e define a tarefa que será deletada (para tarefas em andamento)
  const handleDeleteTask = (index: number) => {
    setTaskToDelete(index);
    setIsCompletedTask(false); // É uma tarefa em andamento
    setIsModalOpen(true); // Abre o modal de confirmação
  };

  // Abre o modal e define a tarefa completada que será deletada
  const handleDeleteCompletedTask = (index: number) => {
    setTaskToDelete(index);
    setIsCompletedTask(true); // É uma tarefa completada
    setIsModalOpen(true); // Abre o modal de confirmação
  };

  // Completa a tarefa
  const completeTask = (index: number) => {
    const taskToComplete = tasks[index];
    setCompletedTasks([...completedTasks, taskToComplete]);
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Atualizar o localStorage
    setCheckedTasks(checkedTasks.filter((i) => i !== index));
  };

  // Confirma a exclusão da tarefa (em andamento ou completada)
  const confirmDeleteTask = () => {
    if (taskToDelete !== null) {
      if (isCompletedTask) {
        removeCompletedTask(taskToDelete); // Remove a tarefa completada
      } else {
        removeTask(taskToDelete); // Remove a tarefa em andamento
      }
      setIsModalOpen(false); // Fecha o modal após a exclusão
      setTaskToDelete(null); // Reseta a tarefa selecionada
    }
  };

  // Cancela a exclusão da tarefa
  const cancelDelete = () => {
    setIsModalOpen(false); // Fecha o modal
    setTaskToDelete(null); // Reseta a tarefa selecionada
  };

  // Lida com a mudança de seleção da checkbox
  const handleCheckboxChange = (index: number) => {
    if (checkedTasks.includes(index)) {
      setCheckedTasks(checkedTasks.filter((i) => i !== index));
    } else {
      setCheckedTasks([...checkedTasks, index]);
      setTimeout(() => completeTask(index), 100);
    }
  };

  // Remove a tarefa
  const removeTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Atualizar o localStorage
    setCheckedTasks(checkedTasks.filter((i) => i !== index));
  };

  // Remove a tarefa completada
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
                onClick={() => handleDeleteTask(index)} // Abre o modal para tarefas em andamento
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
                  onClick={() => handleDeleteCompletedTask(index)} // Abre o modal para tarefas completadas
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
          onDelete={confirmDeleteTask} // Função para confirmar a exclusão
          onCancel={cancelDelete} // Função para cancelar a exclusão
        />
      )}
    </div>
  );
}
