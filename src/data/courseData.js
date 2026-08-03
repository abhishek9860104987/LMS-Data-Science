// ─────────────────────────────────────────────────────────────────────────────
//  HOW TO ADD YOUR YOUTUBE LINKS
//  1. Go to any YouTube video
//  2. Copy the URL: https://www.youtube.com/watch?v=VIDEOID
//  3. Change it to:  https://www.youtube.com/embed/VIDEOID
//  4. Paste it into the `videoUrl` field of the matching lesson below
//  5. Save the file — the video will instantly appear in the player
// ─────────────────────────────────────────────────────────────────────────────

const PLACEHOLDER = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // replace with real links

export const courseData = {
  courseTitle: "Data Science Master",
  courseDescription: "Complete Data Science with Machine Learning, Deep Learning, and AI",
  weeks: [

    // ── Week 1 ─────────────────────────────────────────────────────────────
{
  id: 1,
  title: "Week 1 - Python",
  lessons: [
    {
      id: "1-1",
      title: "Python Crash Course",
      videoUrl: "https://www.youtube.com/embed/VchuKL44s6E",
      duration: "1:19:40",
      completed: false,
      description: "Fast-track introduction to Python programming"
    },
    {
      id: "1-2",
      title: "NumPy",
      videoUrl: "https://www.youtube.com/embed/zI5ducyfyNc",
      duration: "40:50",
      completed: false,
      description: "Numerical computing with NumPy arrays and operations"
    },
    {
      id: "1-3",
      title: "Pandas",
      videoUrl: "https://www.youtube.com/embed/EXIgjIBu4EU",
      duration: "30:37",
      completed: false,
      description: "Data manipulation and analysis with Pandas DataFrames"
    },
    {
      id: "1-4",
      title: "Vectors and Matrices as Data",
      videoUrl: "https://pabloinsente.github.io/intro-linear-algebra",
      completed: false,
      description: "Representing data as vectors and matrices"
    },
    {
      id: "1-5",
      title: "Matrix Operations in Practice",
      videoUrl: "https://www.youtube.com/embed/c09drtuCS3c",
      duration: "34:08",
      completed: false,
      description: "Addition, multiplication, transpose, and inverse operations"
    },
    {
      id: "1-6",
      title: "Eigenvalues and Eigenvectors",
      videoUrl: "https://www.youtube.com/embed/1wjXVdwzgX8",
      duration: "24:21",
      completed: false,
      description: "Eigendecomposition and its applications in ML"
    },
    {
      id: "1-7",
      title: "Dimensionality Reduction Basics",
      videoUrl: "https://www.youtube.com/embed/ToGuhynu-No",
      duration: "15:25",
      completed: false,
      description: "PCA and other dimensionality reduction techniques"
    },
    {
      id: "1-8",
      title: "Stats and It's Types",
      videoUrl: "https://www.youtube.com/embed/7V5jtI-ihm0",
      duration: "15:31",
      completed: false,
      description: "Descriptive vs inferential statistics overview"
    },
    {
      id: "1-9",
      title: "Hypothesis Testing Basics",
      videoUrl: "https://www.youtube.com/embed/OG8L4qzGMoA",
      duration: "9:04",
      completed: false,
      description: "Null hypothesis, p-values, and statistical significance"
    },
    {
      id: "1-10",
      title: "Error Metrics and Graphical Intuition",
      videoUrl: "https://www.youtube.com/embed/l_YszNIJfFA",
      duration: "16:59",
      completed: false,
      description: "Common error metrics visualized with graphical intuition"
    },
    {
      id: "1-11",
      title: "Distribution and Stationarity Testing",
      videoUrl: "https://www.youtube.com/embed/we4p332VoPQ",
      duration: "21:18",
      completed: false,
      description: "Testing data distributions and stationarity in time series"
    },
    {
      id: "1-12",
      title: "Model Monitoring Basics",
      videoUrl: "https://www.youtube.com/embed/tQjRQWfYQ10",
      duration: "17:45",
      completed: false,
      description: "Introduction to model monitoring and observability"
    },
    {
      id: "1-13",
      title: "Core Concepts",
      videoUrl: "https://www.youtube.com/embed/bcv61eKpYto",
      duration: "10:47",
      completed: false,
      description: "Foundational concepts in data science and ML"
    },
    {
      id: "1-14",
      title: "Distributions in the Wild",
      videoUrl: "https://www.youtube.com/embed/DUT4WEUngt0",
      duration: "1:34:05",
      completed: false,
      description: "Common probability distributions and their real-world applications"
    },
    {
      id: "1-15",
      title: "Bayes' Theorem Intuition",
      videoUrl: "https://www.youtube.com/embed/zeJD6dqJ5lo",
      duration: "1:20:29",
      completed: false,
      description: "Understanding Bayes' theorem with intuitive examples"
    },
    {
      id: "1-16",
      title: "The Central Limit Theorem (CLT)",
      videoUrl: "",
      duration: "31:14",
      completed: false,
      description: "Why the CLT is the cornerstone of statistical inference"
    }
  ]
},

    // ── Week 2 ─────────────────────────────────────────────────────────────
    {
  id: 2,
  title: "Week 2 - Classical Machine Learning",
  lessons: [
    {
      id: "2-1",
      title: "Types of ML",
      videoUrl: "https://www.youtube.com/embed/ZftI2fEz0Fw",
      duration: "20:00",
      completed: false,
      description: "Supervised, unsupervised, and reinforcement learning overview"
    },
    {
      id: "2-2",
      title: "ML Pipeline",
      videoUrl: "https://www.youtube.com/embed/iDbhQGz_rEo",
      duration: "25:13",
      completed: false,
      description: "End-to-end machine learning pipeline walkthrough"
    },
    {
      id: "2-3",
      title: "Bias-Variance Tradeoff",
      videoUrl: "https://www.youtube.com/embed/m5E6QxKFYlM",
      duration: "12:17",
      completed: false,
      description: "Understanding bias, variance, and the tradeoff between them"
    },
    {
      id: "2-4",
      title: "Overfitting and Underfitting",
      videoUrl: "https://www.youtube.com/embed/m5E6QxKFYlM",
      duration: "12:17",
      completed: false,
      description: "Diagnosing and fixing overfitting and underfitting models"
    },
    {
      id: "2-5",
      title: "Data Cleaning",
      videoUrl: "https://www.youtube.com/embed/ToGuhynu-No",
      duration: "15:24",
      completed: false,
      description: "Handling missing values, outliers, and noisy data"
    },
    {
      id: "2-6",
      title: "Exploratory Data Analysis (EDA)",
      videoUrl: "https://www.youtube.com/embed/4HyTlbHUKSw",
      duration: "30:31",
      completed: false,
      description: "Techniques to explore and summarize datasets"
    },
    {
      id: "2-7",
      title: "Encoding Techniques",
      videoUrl: "https://www.youtube.com/embed/w2GglmYHfmM",
      duration: "19:53",
      completed: false,
      description: "Label encoding, one-hot encoding, target encoding and more"
    },
    {
      id: "2-8",
      title: "Feature Scaling",
      videoUrl: "https://www.youtube.com/embed/1Yw9sC0PNwY",
      duration: "32:38",
      completed: false,
      description: "Normalization, standardization, and when to use each"
    },
    {
      id: "2-9",
      title: "Feature Engineering",
      videoUrl: "https://www.youtube.com/embed/sluoVhT0ehg",
      duration: "24:52",
      completed: false,
      description: "Creating new features to improve model performance"
    },
    {
      id: "2-10",
      title: "Pipelines",
      videoUrl: "https://www.youtube.com/embed/xOccYkgRV4Q",
      duration: "45:39",
      completed: false,
      description: "Building reproducible ML pipelines with scikit-learn"
    },
    {
      id: "2-11",
      title: "Data Leakage",
      videoUrl: "https://www.youtube.com/embed/Lln1PKgGr_M",
      duration: "17:07",
      completed: false,
      description: "Identifying and preventing data leakage in ML projects"
    },
    {
      id: "2-12",
      title: "Linear Regression",
      videoUrl: "https://www.youtube.com/embed/UZPfbG0jNec",
      duration: "33:36",
      completed: false,
      description: "Simple and multiple linear regression from scratch"
    },
    {
      id: "2-13",
      title: "Ridge Regression (L2)",
      videoUrl: "https://www.youtube.com/embed/aEow1QoTLo0",
      duration: "19:58",
      completed: false,
      description: "L2 regularization and ridge regression"
    },
    {
      id: "2-14",
      title: "Lasso Regression (L1)",
      videoUrl: "https://www.youtube.com/embed/HLF4bFbBgwk",
      duration: "28:37",
      completed: false,
      description: "L1 regularization, lasso regression, and feature selection"
    },
    {
      id: "2-15",
      title: "Evaluation Metrics",
      videoUrl: "https://www.youtube.com/embed/Ti7c-Hz7GSM",
      duration: "43:56",
      completed: false,
      description: "MAE, MSE, RMSE, R² and other regression evaluation metrics"
    },
    {
      id: "2-16",
      title: "Cross Validation",
      videoUrl: "https://www.youtube.com/embed/S5NkE-xgx98",
      duration: "15:19",
      completed: false,
      description: "K-fold, stratified, and leave-one-out cross validation"
    },
    {
      id: "2-17",
      title: "Hyperparameter Tuning",
      videoUrl: "https://www.youtube.com/embed/Us5ZFp16PaU",
      duration: "15:35",
      completed: false,
      description: "Grid search, random search, and Bayesian optimization"
    },
    {
      id: "2-18",
      title: "Time Series Components",
      videoUrl: "https://www.youtube.com/embed/i7HARZlJv7Y",
      duration: "03:24",
      completed: false,
      description: "Trend, seasonality, and residuals in time series"
    },
    {
      id: "2-19",
      title: "Stationarity",
      videoUrl: "https://www.youtube.com/embed/621MSxpYv60",
      duration: "09:37",
      completed: false,
      description: "Testing and achieving stationarity in time series data"
    },
    {
      id: "2-20",
      title: "Lag Features",
      videoUrl: "https://www.youtube.com/embed/4Vq8KqbHKh8",
      duration: "09:35",
      completed: false,
      description: "Creating lag features for time series forecasting"
    },
    {
      id: "2-21",
      title: "Rolling Statistics",
      videoUrl: "https://www.youtube.com/embed/-_2wOrEuFaM",
      duration: "16:02",
      completed: false,
      description: "Rolling mean, rolling std, and window functions"
    },
    {
      id: "2-22",
      title: "Forecasting",
      videoUrl: "https://www.youtube.com/embed/jhh4tHYmVew",
      duration: "05:31",
      completed: false,
      description: "ARIMA, SARIMA, and ML-based forecasting approaches"
    },
    {
      id: "2-23",
      title: "Chronological Split",
      videoUrl: "https://www.youtube.com/embed/1rZpbvSI26c",
      duration: "10:34",
      completed: false,
      description: "Why time series data needs chronological train/test splits"
    }
  ]
},

    // ── Week 3 ─────────────────────────────────────────────────────────────
   {
  id: 3,
  title: "Week 3 - Classification",
  lessons: [
    {
      id: "3-1",
      title: "Logistic Regression",
      videoUrl: "https://www.youtube.com/embed/XNXzVfItWGY",
      duration: "47:06",
      completed: false,
      description: "Binary and multiclass logistic regression"
    },
    {
      id: "3-2",
      title: "Naive Bayes",
      videoUrl: "https://www.youtube.com/embed/Ty7knppVo9E",
      duration: "09:25",
      completed: false,
      description: "Gaussian, Bernoulli, and Multinomial Naive Bayes"
    },
    {
      id: "3-3",
      title: "K-Nearest Neighbors",
      videoUrl: "https://www.youtube.com/embed/abnL_GUGub4",
      duration: "25:01",
      completed: false,
      description: "KNN algorithm for classification and regression"
    },
    {
      id: "3-4",
      title: "SVM",
      videoUrl: "https://www.youtube.com/embed/9iD8DMF6odw",
      duration: "25:23",
      completed: false,
      description: "Support Vector Machines with kernel tricks"
    },
    {
      id: "3-5",
      title: "Evaluation Metrics",
      videoUrl: "https://www.youtube.com/embed/Ti7c-Hz7GSM",
      duration: "43:55",
      completed: false,
      description: "Accuracy, precision, recall, F1, ROC-AUC"
    },
    {
      id: "3-6",
      title: "Decision Tree",
      videoUrl: "https://www.youtube.com/embed/IZnno-dKgVQ",
      duration: "58:28",
      completed: false,
      description: "Decision tree algorithm, Gini impurity, and information gain"
    },
    {
      id: "3-7",
      title: "Random Forest",
      videoUrl: "https://www.youtube.com/embed/F9uESCHGjhA",
      duration: "33:25",
      completed: false,
      description: "Ensemble learning with bagging and random forests"
    },
    {
      id: "3-8",
      title: "Feature Importance",
      videoUrl: "https://www.youtube.com/embed/R47JAob1xBY",
      duration: "27:19",
      completed: false,
      description: "Understanding and visualizing feature importance"
    },
    {
      id: "3-9",
      title: "AdaBoost",
      videoUrl: "https://www.youtube.com/embed/sFKnP0iP0K0",
      duration: "17:14",
      completed: false,
      description: "Adaptive Boosting and weak learner ensembles"
    },
    {
      id: "3-10",
      title: "Gradient Boosting",
      videoUrl: "https://www.youtube.com/embed/4p5EQtyxSyI",
      duration: "1:04:33",
      completed: false,
      description: "Gradient boosting machines from scratch"
    },
    {
      id: "3-11",
      title: "XGBoost",
      videoUrl: "https://www.youtube.com/embed/C6aDw4y8qJ0",
      duration: "01:19:37",
      completed: false,
      description: "Extreme Gradient Boosting — theory and implementation"
    },
    {
      id: "3-12",
      title: "LightGBM",
      videoUrl: "https://www.youtube.com/embed/9uxWzeLglr0",
      duration: "10:48",
      completed: false,
      description: "LightGBM — fast, distributed gradient boosting"
    },
    {
      id: "3-13",
      title: "Stacking",
      videoUrl: "https://www.youtube.com/embed/O-aDHBGMqXA",
      duration: "35:20",
      completed: false,
      description: "Stacked generalization and meta-learning ensembles"
    },
    {
      id: "3-14",
      title: "K-Means",
      videoUrl: "https://www.youtube.com/embed/5shTLzwAdEc",
      duration: "23:57",
      completed: false,
      description: "K-Means clustering algorithm and elbow method"
    },
    {
      id: "3-15",
      title: "K-Medoids",
      videoUrl: "https://www.youtube.com/embed/qKHKWnjQlFQ",
      duration: "10:52",
      completed: false,
      description: "K-Medoids (PAM) — robust alternative to K-Means"
    },
    {
      id: "3-16",
      title: "DBSCAN",
      videoUrl: "https://www.youtube.com/embed/1_bLnsNmhCI",
      duration: "34:16",
      completed: false,
      description: "Density-Based Spatial Clustering of Applications with Noise"
    },
    {
      id: "3-17",
      title: "Hierarchical Clustering",
      videoUrl: "https://www.youtube.com/embed/Ka5i9TVUT-E",
      duration: "37:22",
      completed: false,
      description: "Agglomerative and divisive hierarchical clustering"
    },
    {
      id: "3-18",
      title: "Evaluation",
      videoUrl: "https://www.youtube.com/embed/TjDytm85d78",
      duration: "18:34",
      completed: false,
      description: "Clustering evaluation: silhouette score, Davies-Bouldin index"
    }
  ]
},

    // ── Week 4 ─────────────────────────────────────────────────────────────
    {
  id: 4,
  title: "Week 4 - Intro to DL",
  lessons: [
    {
      id: "4-1",
      title: "Perceptron",
      videoUrl: "https://www.geeksforgeeks.org/deep-learning/what-is-perceptron-the-simplest-artificial-neural-network/",
      completed: false,
      description: "The biological neuron and the perceptron model"
    },
    {
      id: "4-2",
      title: "MLP",
      videoUrl: "https://www.geeksforgeeks.org/deep-learning/multi-layer-perceptron-learning-in-tensorflow/",
      completed: false,
      description: "Multi-Layer Perceptron architecture and universal approximation"
    },
    {
      id: "4-3",
      title: "Forward Pass",
      videoUrl: "https://www.geeksforgeeks.org/deep-learning/feedforward-neural-network/",
      completed: false,
      description: "How data flows forward through a neural network"
    },
    {
      id: "4-4",
      title: "Backpropagation",
      videoUrl: "https://www.geeksforgeeks.org/machine-learning/backpropagation-in-neural-network/",
      completed: false,
      description: "Chain rule, gradients, and backpropagation algorithm"
    },
    {
      id: "4-5",
      title: "Sigmoid and Tanh",
      videoUrl: "https://www.geeksforgeeks.org/machine-learning/derivative-of-the-sigmoid-function/",
      completed: false,
      description: "Sigmoid and hyperbolic tangent activation functions"
    },
    {
      id: "4-6",
      title: "ReLU Family",
      videoUrl: "https://www.geeksforgeeks.org/deep-learning/relu-activation-function-in-deep-learning/",
      completed: false,
      description: "ReLU, Leaky ReLU, ELU, GELU and dying neuron problem"
    },
    {
      id: "4-7",
      title: "Loss Functions (DL)",
      videoUrl: "https://www.youtube.com/embed/gb5nm_3jBIo",
      duration: "59:56",
      completed: false,
      description: "Cross-entropy, MSE, Huber loss for deep learning"
    },
    {
      id: "4-8",
      title: "Convolution Layer",
      videoUrl: "https://www.youtube.com/embed/9wmImImmgcI",
      duration: "35:23",
      completed: false,
      description: "Convolution operation, filters, and feature maps"
    },
    {
      id: "4-9",
      title: "Pooling and Stride",
      videoUrl: "https://www.youtube.com/embed/DwmGefkowCU",
      duration: "27:53",
      completed: false,
      description: "Max pooling, average pooling, and stride explained"
    },
    {
      id: "4-10",
      title: "Padding",
      videoUrl: "https://www.youtube.com/embed/btWE6SsdDZA",
      duration: "24:26",
      completed: false,
      description: "Same vs valid padding and its effect on output dimensions"
    },
    {
      id: "4-11",
      title: "CNN Architectures",
      videoUrl: "https://www.youtube.com/embed/ewsvsJQOuTI",
      duration: "20:00",
      completed: false,
      description: "LeNet, AlexNet, VGG, ResNet, and Inception"
    },
    {
      id: "4-12",
      title: "Transfer Learning",
      videoUrl: "https://www.youtube.com/embed/0MVXteg7TB4",
      duration: "24:28",
      completed: false,
      description: "Fine-tuning pretrained CNNs for custom tasks"
    }
  ]
},

    // ── Week 5 ─────────────────────────────────────────────────────────────
    {
  id: 5,
  title: "Week 5 - RNN",
  lessons: [
    {
      id: "5-1",
      title: "RNN Architecture",
      videoUrl: "https://www.youtube.com/embed/4KpRP-YUw6c",
      duration: "30:18",
      completed: false,
      description: "Recurrent Neural Network structure and hidden state"
    },
    {
      id: "5-2",
      title: "BPTT",
      videoUrl: "https://www.youtube.com/embed/AWHSZzp96kM",
      duration: "32:18",
      completed: false,
      description: "Backpropagation Through Time and vanishing gradients"
    },
    {
      id: "5-3",
      title: "RNN Applications",
      videoUrl: "https://www.youtube.com/embed/JgnbwKnHMZQ",
      duration: "36:57",
      completed: false,
      description: "Sequence modeling, text generation, and sentiment analysis"
    },
    {
      id: "5-4",
      title: "Gates (Forget / Input / Output)",
      videoUrl: "https://www.youtube.com/embed/z7IPBg6MyrU",
      duration: "42:18",
      completed: false,
      description: "LSTM gates — forget, input, and output gate mechanics"
    },
    {
      id: "5-5",
      title: "Cell State vs Hidden State",
      videoUrl: "https://www.youtube.com/embed/fiqo6uPCJVI",
      duration: "1:00:05",
      completed: false,
      description: "Long-term vs short-term memory in LSTM networks"
    },
    {
      id: "5-6",
      title: "LSTM Applications",
      videoUrl: "https://www.youtube.com/embed/fiqo6uPCJVI",
      duration: "1:00:05",
      completed: false,
      description: "Time series forecasting, NLP, and speech with LSTM"
    },
    {
      id: "5-7",
      title: "Update Gate",
      videoUrl: "https://www.youtube.com/embed/QQfZAoNGQmE",
      duration: "1:26:22",
      completed: false,
      description: "GRU update gate and reset gate explained"
    },
    {
      id: "5-8",
      title: "GRU vs LSTM",
      videoUrl: "https://www.youtube.com/embed/TkOBxzhIySg",
      duration: "22:20",
      completed: false,
      description: "Comparing Gated Recurrent Units and LSTM architectures"
    },
    {
      id: "5-9",
      title: "Attention Mechanism",
      videoUrl: "https://www.youtube.com/embed/KiL74WsgxoA",
      duration: "1:13:42",
      completed: false,
      description: "Bahdanau and Luong attention for sequence-to-sequence models"
    },
    {
      id: "5-10",
      title: "Multi-Head Attention",
      videoUrl: "https://www.youtube.com/embed/bX2QwpjsmuA",
      duration: "18:27",
      completed: false,
      description: "Scaled dot-product attention and multi-head attention"
    },
    {
      id: "5-11",
      title: "Positional Encoding",
      videoUrl: "https://www.youtube.com/embed/GeoQBNNqIbM",
      duration: "1:13:14",
      completed: false,
      description: "How transformers encode sequence order without recurrence"
    },
    {
      id: "5-12",
      title: "Transformer Architecture",
      videoUrl: "https://www.geeksforgeeks.org/nlp/transformers-parameters/",
      completed: false,
      description: "Encoder-decoder transformer: Attention is All You Need"
    },
    {
      id: "5-13",
      title: "BERT vs GPT",
      videoUrl: "https://www.youtube.com/embed/HOIaznZjrG0",
      duration: "05:59",
      completed: false,
      description: "Bidirectional encoder vs autoregressive decoder models"
    }
  ]
},

    // ── Week 6 ─────────────────────────────────────────────────────────────
    {
  id: 6,
  title: "Week 6 - AE and GAN",
  lessons: [
    {
      id: "6-1",
      title: "Autoencoder",
      videoUrl: "https://www.youtube.com/embed/hZ4a4NgM3u0",
      duration: "11:40",
      completed: false,
      description: "Encoder-decoder architecture for unsupervised learning"
    },
    {
      id: "6-2",
      title: "Variational Autoencoder",
      videoUrl: "https://www.youtube.com/embed/nTt_ajul8NY",
      duration: "23:58",
      completed: false,
      description: "VAE — latent space sampling and the reparameterization trick"
    },
    {
      id: "6-3",
      title: "GAN – Generator,GAN – Discriminator GAN Training",
      videoUrl: "https://www.youtube.com/embed/nTt_ajul8NY",
      duration: "23:58",
      completed: false,
      description: "Generator network: mapping noise to realistic samples"
    },
   

    {
      id: "6-4",
      title: "SGD+Momentum,adaGrad RMSprop Adam",
      videoUrl: "https://www.youtube.com/embed/TudQZtgpoHk",
      duration: "1:41:54",
      completed: false,
      description: "Adaptive Moment Estimation — the most popular optimizer"
    },
    {
      id: "6-5",
      title: "Intro to GenAI",
      videoUrl: "https://www.youtube.com/embed/G2fqAlgmoPo",
      duration: "22:07",
      completed: false,
      description: "Overview of generative AI models and applications"
    },
    {
      id: "6-6",
      title: "RAG (LangChain)",
      videoUrl: "https://www.youtube.com/embed/fZM3oX4xEyg",
      duration: "20:39",
      completed: false,
      description: "Building a RAG pipeline using LangChain framework"
    },
    {
      id: "6-7",
      title: "RAG (LangChain) Cont.",
      videoUrl: "https://www.youtube.com/embed/nAmC7SoVLd8",
      duration: "46:06",
      completed: false,
      description: "Advanced RAG patterns with LangChain — Part 2"
    },
    {
      id: "6-8",
      title: "Prompt Engineering",
      videoUrl: "https://www.youtube.com/embed/FQNUkIxzrpo",
      duration: "16:45",
      completed: false,
      description: "Zero-shot, few-shot, chain-of-thought prompting techniques"
    }
  ]
},

    // ── Week 7 ─────────────────────────────────────────────────────────────
{
  id: 7,
  title: "Week 7 - RAG and LLMs",
  lessons: [
    {
      id: "7-1",
      title: "Advanced RAG",
      videoUrl: "https://www.youtube.com/embed/K1F8BIgcoNk",
      duration: "13:38",
      completed: false,
      description: "Advanced Retrieval-Augmented Generation techniques"
    },
    {
      id: "7-2",
      title: "LLM Internals",
      videoUrl: "https://www.youtube.com/embed/zjkBMFhNj_g",
      duration: "38:34",
      completed: false,
      description: "Understanding Large Language Model architecture internals"
    },
    {
      id: "7-3",
      title: "Fine-Tuning (LoRA/PEFT)",
      videoUrl: "https://www.youtube.com/embed/TjDytm85d78",
      duration: "18:34",
      completed: false,
      description: "Parameter-efficient fine-tuning with LoRA and PEFT"
    },
    {
      id: "7-4",
      title: "LLM Evaluation",
      videoUrl: "https://www.youtube.com/embed/Us5ZFp16PaU",
      duration: "15:35",
      completed: false,
      description: "Evaluating LLM performance and benchmarks"
    },
    {
      id: "7-5",
      title: "ReAct Framework",
      videoUrl: "https://www.youtube.com/embed/WBgI9ce_7wM",
      duration: "6:49",
      completed: false,
      description: "Reasoning and Acting framework for LLM agents"
    }
  ]
},

    // ── Week 8 ─────────────────────────────────────────────────────────────
    {
      id: 8,
      title: "Week 8 - Agentic AI",
      lessons: [
        {
          id: "8-1",
          title: "LangGraph Overview",
          videoUrl: "https://docs.langchain.com/oss/python/langgraph/overview",
          completed: false,
          description: "Building multi-agent stateful workflows with LangGraph"
        },
        {
          id: "8-2",
          title: "AutoGen, Tool Use and Function Calling",
          videoUrl:"https://www.youtube.com/embed/yDpV_jgO93c",
          duration: "04:04:06",
          completed: false,
          description: "Frameworks for autonomous agents, tool use, and function calling"
        },
        {
          id: "8-3",
          title: "Agent Evaluation",
          videoUrl: "https://www.youtube.com/embed/TjDytm85d78",
          duration: "18:35",
          completed: false,
          description: "Evaluating the performance of agentic AI systems"
        }
      ]
    }

  ]
};

// ── Utility helpers (used by App.jsx — do not remove) ─────────────────────────

export const getFirstLesson = () => courseData.weeks[0].lessons[0];

export const getLessonById = (lessonId) => {
  for (const week of courseData.weeks) {
    const lesson = week.lessons.find(l => l.id === lessonId);
    if (lesson) return lesson;
  }
  return null;
};

export const getNextLesson = (currentLessonId) => {
  for (let wi = 0; wi < courseData.weeks.length; wi++) {
    const week = courseData.weeks[wi];
    for (let li = 0; li < week.lessons.length; li++) {
      if (week.lessons[li].id === currentLessonId) {
        if (li < week.lessons.length - 1) return week.lessons[li + 1];
        if (wi < courseData.weeks.length - 1) return courseData.weeks[wi + 1].lessons[0];
      }
    }
  }
  return null;
};

export const getPreviousLesson = (currentLessonId) => {
  for (let wi = 0; wi < courseData.weeks.length; wi++) {
    const week = courseData.weeks[wi];
    for (let li = 0; li < week.lessons.length; li++) {
      if (week.lessons[li].id === currentLessonId) {
        if (li > 0) return week.lessons[li - 1];
        if (wi > 0) {
          const prev = courseData.weeks[wi - 1];
          return prev.lessons[prev.lessons.length - 1];
        }
      }
    }
  }
  return null;
};

export const getProgress = () => {
  let total = 0, completed = 0;
  courseData.weeks.forEach(week => {
    total     += week.lessons.length;
    completed += week.lessons.filter(l => l.completed).length;
  });
  return {
    total,
    completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0
  };
};
