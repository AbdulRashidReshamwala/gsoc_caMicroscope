from flask import Flask, jsonify, request
from flask_cors import cross_origin
from zipfile import ZipFile
from dbutility import Dataset, Model, engine
from sqlalchemy.orm import sessionmaker
import os

app = Flask(__name__)
Session = sessionmaker(bind=engine)


@app.route('/')
@cross_origin()
def index():
    return jsonify(msg='base url of backend')


@app.route('/dataset/all')
@cross_origin()
def get_all_dataset():
    session = Session()
    d = session.query(Dataset).all()
    datasets = []
    for temp in d:
        datasets.append(temp.to_json())
    return jsonify(datasets=datasets)


@app.route('/dataset/view/<int:id>')
@cross_origin()
def get_dataset_info(id):
    session = Session()
    dataset = session.query(Dataset).filter_by(id=id).one().to_json()
    classes = os.listdir(os.path.join('static', 'datasets', dataset['name']))
    files = []
    for d in classes:
        files.append(os.listdir(os.path.join(
            'static', 'datasets', dataset['name'], d)))
    dataset['files'] = files
    dataset['classes'] = classes
    return dataset


@app.route('/dataset/upload', methods=['POST'])
@cross_origin()
def upload_dataset():
    session = Session()
    zip_file = request.files['file']
    dataset_name = request.form['name']
    zip_path = os.path.join('static', 'uploads', zip_file.filename)
    zip_file.save(zip_path)
    dataset_path = os.path.join('static', 'datasets', dataset_name)
    with ZipFile(zip_path) as z:
        z.extractall(dataset_path)
    no_images = 0
    no_classes = 0
    for c in os.listdir(dataset_path):
        no_classes += 1
        no_images += len(os.listdir(os.path.join(dataset_path, c)))
    dataset = Dataset(name=dataset_name, no_classes=no_classes,
                      no_image=no_images, status='created')
    session.add(dataset)
    session.commit()
    return jsonify(msg='sucess data saved sucessfully', dataset_name=dataset_name, no_classes=no_classes, no_images=no_images)


if __name__ == "__main__":
    app.run(debug=True)
