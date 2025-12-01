# Tarefa 1 - TADS - Funções para obter primeiro e último da lista


defmodule Tarefas do
  # Função para obter o primeiro elemento
  def primeiro([head | _tail]), do: head
  def primeiro([]), do: nil

  # Função recursiva para obter o último elemento
  def ultimo([x]), do: x
  def ultimo([_head | tail]), do: ultimo(tail)
  def ultimo([]), do: nil
end