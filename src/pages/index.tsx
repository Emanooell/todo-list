import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import trashIcon from "./trash.svg";
import Image from "next/image";

// Definindo o tipo das tasks como uma string
type Task = string;

export default function Home() {
  const router = useRouter();

  // Definindo os estados com tipagens corretas
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([
    "Comprar mantimentos",
    "Estudar Next.js",
    "Fazer exercícios",
    "Terminar minha apresentação",
  ]);

  // Estado para armazenar os índices das tarefas marcadas
  const [checkedTasks, setCheckedTasks] = useState<number[]>([]);

  // Função para mover a tarefa para tarefas finalizadas
  const completeTask = (taskIndex: number) => {
    const taskToComplete = tasks[taskIndex];
    setCompletedTasks([...completedTasks, taskToComplete]);
    setTasks(tasks.filter((_, index) => index !== taskIndex));
    setCheckedTasks(checkedTasks.filter((index) => index !== taskIndex)); // Limpa o checkbox
  };

  // Função para lidar com a mudança do checkbox
  const handleCheckboxChange = (index: number) => {
    if (checkedTasks.includes(index)) {
      setCheckedTasks(checkedTasks.filter((taskIndex) => taskIndex !== index)); // Desmarca
    } else {
      setCheckedTasks([...checkedTasks, index]); // Marca

      // Aqui chamamos `completeTask` somente após a marcação
      setTimeout(() => completeTask(index), 100);
    }
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
              checked={checkedTasks.includes(index)} // Controla o estado do checkbox
              onChange={() => handleCheckboxChange(index)} // Controla a marcação e chama `completeTask`
            />
            {task}
            <div className={styles.containerTrash}>
              <Image
                className={styles.img}
                src={trashIcon}
                alt="Icone de lixeira"
                onClick={() => console.log("botão clicado")}
              />
            </div>
          </li>
        ))}
      </ul>

      <h4 className={styles.title}>Atividades Finalizadas</h4>
      <ul className={styles.taskList}>
        {completedTasks.map((task, index) => (
          <li key={index} className={styles.taskItem}>
            <span>{task}</span>
          </li>
        ))}
      </ul>

      <button
        className={styles.addButton}
        onClick={() => router.push("/addTask")}
      >
        Adicionar Nova Tarefa
      </button>
    </div>
  );
}
